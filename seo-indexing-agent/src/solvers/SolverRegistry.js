'use strict';

const { PageSpeedSolver } = require('./PageSpeedSolver');
const { BingWebmasterSolver } = require('./BingWebmasterSolver');
const { W3CValidatorSolver } = require('./W3CValidatorSolver');
const { SchemaValidatorSolver } = require('./SchemaValidatorSolver');

/**
 * SolverRegistry — algorithm that picks the right external API to use
 * for each issue type, then runs them in priority order until one wins.
 *
 * For every "fixing" issue that's failed 2+ in-house attempts, the
 * registry asks each registered solver: "canYouSolve(issue)?"  When a
 * solver says yes, it runs and either fixes the issue (auto-commits via
 * GitHub) or returns a richer diagnosis the next run can act on.
 */
class SolverRegistry {
  constructor(config = {}) {
    this.config = config;
    this.solvers = [
      new PageSpeedSolver(config),       // Free Google API — specific perf fixes
      new W3CValidatorSolver(config),    // Free W3C API — exact HTML errors
      new SchemaValidatorSolver(config), // Free schema.org validator
      new BingWebmasterSolver(config),   // Free Bing API — more indexing
    ];
  }

  /**
   * Returns the best solver(s) for a given issue, sorted by suitability.
   */
  match(issue) {
    return this.solvers
      .map(s => ({ solver: s, score: s.score(issue) }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(x => x.solver);
  }

  /**
   * Run all matching solvers on an issue until one returns a successful fix.
   * Returns { solved: boolean, solverUsed, diagnosis, fix }.
   */
  async solve(issue, ctx = {}) {
    const candidates = this.match(issue);
    if (candidates.length === 0) {
      return { solved: false, reason: 'no-matching-solver', issue: issue.title };
    }

    const attempts = [];
    for (const solver of candidates) {
      try {
        const result = await solver.attempt(issue, ctx);
        attempts.push({ solver: solver.name, ...result });
        if (result.solved) {
          return {
            solved: true,
            solverUsed: solver.name,
            diagnosis: result.diagnosis,
            fix: result.fix,
            attempts,
          };
        }
      } catch (err) {
        attempts.push({ solver: solver.name, error: err.message });
      }
    }

    // No solver fully solved it — return the richest diagnosis
    const bestDiagnosis = attempts.find(a => a.diagnosis);
    return {
      solved: false,
      diagnosis: bestDiagnosis?.diagnosis || null,
      attempts,
    };
  }
}

module.exports = { SolverRegistry };
