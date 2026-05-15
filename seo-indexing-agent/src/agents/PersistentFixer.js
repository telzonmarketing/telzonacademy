'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * PersistentFixer — tracks each detected issue through its lifecycle
 * (detected → fixing → resolved or escalated) across runs.
 *
 * The basic IssueFixer just generates a fix once and forgets. This
 * tracker remembers which issues are still open after the fix attempt,
 * tries different strategies on the next run, and marks issues won
 * once an audit no longer detects them.
 *
 * State lives in public/seo-reports/issue-tracker.json so it's visible
 * on the dashboard and survives across runs.
 */
class PersistentFixer {
  constructor(config = {}) {
    this.config = config;
    this.statePath = config.statePath || 'public/seo-reports/issue-tracker.json';
    this.maxAttempts = config.maxAttempts || 5;
  }

  load() {
    try {
      if (fs.existsSync(this.statePath)) {
        return JSON.parse(fs.readFileSync(this.statePath, 'utf8'));
      }
    } catch (_) {}
    return { issues: {}, stats: { open: 0, fixing: 0, resolved: 0, escalated: 0 } };
  }

  save(state) {
    fs.mkdirSync(path.dirname(this.statePath), { recursive: true });
    fs.writeFileSync(this.statePath, JSON.stringify(state, null, 2));
  }

  _idFor(issue) {
    // Stable ID per (type + title) — survives runs
    return crypto
      .createHash('md5')
      .update((issue.type || '') + '::' + (issue.title || ''))
      .digest('hex')
      .slice(0, 12);
  }

  /**
   * Reconcile detected issues with tracked state.
   * Returns updated state + the actions that happened this run.
   */
  reconcile(detectedIssues = [], appliedFixes = []) {
    const state = this.load();
    const now = new Date().toISOString();
    const actions = [];
    const detectedIds = new Set();

    // 1. Open or update each detected issue
    for (const issue of detectedIssues) {
      const id = this._idFor(issue);
      detectedIds.add(id);
      const existing = state.issues[id];

      if (!existing) {
        // First time seeing this issue
        state.issues[id] = {
          id,
          type:        issue.type,
          severity:    issue.severity,
          title:       issue.title,
          description: issue.description,
          status:      'open',
          detectedAt:  now,
          lastSeenAt:  now,
          attempts:    [],
          firstSeenRun: now,
        };
        actions.push({ id, type: 'opened', title: issue.title });
      } else {
        // Issue still present
        existing.lastSeenAt = now;
        if (existing.status === 'resolved') {
          // Issue regressed — reopen
          existing.status = 'regressed';
          existing.regressedAt = now;
          actions.push({ id, type: 'regressed', title: issue.title });
        }
      }
    }

    // 2. Mark applied fixes against open issues
    for (const fix of appliedFixes) {
      // Match fix to issue by title (best-effort)
      for (const id in state.issues) {
        const trk = state.issues[id];
        if (trk.status === 'resolved') continue;
        if (
          (fix.issue && trk.title && fix.issue.includes(trk.title.slice(0, 30))) ||
          (fix.title && trk.title && fix.title.includes(trk.title.slice(0, 30)))
        ) {
          trk.status = 'fixing';
          trk.attempts.push({
            timestamp: now,
            strategy:  fix.title || fix.description || 'auto-fix',
            file:      fix.file || fix.fileChange?.path || null,
          });
          actions.push({ id, type: 'fix-attempted', title: trk.title, attempt: trk.attempts.length });
          break;
        }
      }
    }

    // 3. Mark issues NOT detected this run as resolved (if previously open/fixing)
    for (const id in state.issues) {
      const trk = state.issues[id];
      if (!detectedIds.has(id) && (trk.status === 'open' || trk.status === 'fixing' || trk.status === 'regressed')) {
        trk.status = 'resolved';
        trk.resolvedAt = now;
        const days = trk.detectedAt
          ? Math.max(1, Math.round((new Date(now) - new Date(trk.detectedAt)) / 86400000))
          : null;
        trk.daysToResolve = days;
        actions.push({ id, type: 'resolved', title: trk.title, daysToResolve: days, attempts: trk.attempts.length });
      }
    }

    // 4. Escalate issues that failed too many attempts
    for (const id in state.issues) {
      const trk = state.issues[id];
      if ((trk.status === 'fixing' || trk.status === 'open') &&
          trk.attempts.length >= this.maxAttempts &&
          detectedIds.has(id)) {
        trk.status = 'escalated';
        trk.escalatedAt = now;
        trk.escalationReason = `Issue persists after ${trk.attempts.length} auto-fix attempts. Needs human intervention.`;
        actions.push({ id, type: 'escalated', title: trk.title, attempts: trk.attempts.length });
      }
    }

    // 5. Recompute stats
    state.stats = { open: 0, fixing: 0, resolved: 0, escalated: 0, regressed: 0 };
    for (const id in state.issues) {
      state.stats[state.issues[id].status] = (state.stats[state.issues[id].status] || 0) + 1;
    }
    state.lastReconciled = now;

    this.save(state);
    return { state, actions };
  }
}

module.exports = { PersistentFixer };
