function slug(value) {
  return String(value || 'lead')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'lead'
}

function line(value) {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

function tableCell(value) {
  return line(value).replace(/\|/g, '\\|')
}

export function clientProposal(lead) {
  if (!lead.draft?.proposalMarkdown) throw new Error('This lead has no proposal draft yet.')
  return `${lead.draft.proposalMarkdown.trim()}\n`
}

export function internalBrief(lead) {
  const draft = lead.draft
  if (!draft) throw new Error('This lead has no draft yet.')

  const checklist = draft.checklist?.length
    ? [
        '| Area | Check | Why it matters | Priority |',
        '| --- | --- | --- | --- |',
        ...draft.checklist.map(
          (item) =>
            `| ${tableCell(item.area)} | ${tableCell(item.item)} | ${tableCell(item.why)} | ${tableCell(item.priority)} |`,
        ),
      ].join('\n')
    : '_No checklist items._'

  const list = (items) =>
    items?.length ? items.map((item) => `- ${item}`).join('\n') : '_None recorded._'

  return `# Internal brief — ${line(lead.business || lead.name) || lead.id}

**Lead:** ${line(lead.name) || 'Unknown'}${lead.business ? ` · ${line(lead.business)}` : ''}
**Status:** ${lead.status}
**Business type:** ${line(lead.businessType) || 'Not provided'}
**Service requested:** ${line(lead.service) || 'Not provided'}
**Budget stated:** ${line(lead.budget) || 'Not provided'}
**Timeline stated:** ${line(lead.timeline) || 'Not provided'}
**Fit:** ${draft.fit} — ${line(draft.fitReason) || 'No reason recorded.'}
**Generated:** ${draft.generatedAt || 'Unknown'} with ${draft.model || 'unknown model'}
**Reviewer:** ${draft.reviewer || 'Not reviewed'}
**Approved:** ${draft.approvedAt || 'Not approved'}

## Internal summary

${line(draft.summary) || '_No summary._'}

## Proposal

${draft.proposalMarkdown.trim()}

## Audit checklist

${checklist}

## Questions for the lead

${list(draft.questions)}

## Risks

${list(draft.risks)}

## Assumptions

${list(draft.assumptions)}

## Next action

${line(draft.nextAction) || '_No next action recorded._'}

## Review notes

${line(draft.reviewNotes) || '_No review notes._'}

---

_This brief was produced by Studio Desk for human review. Nothing was sent automatically._
`
}

export function downloadName(lead, kind) {
  const base = `khatri-${kind}-${slug(lead.business || lead.name)}-${lead.id.replace(/[^A-Za-z0-9-]/g, '')}`
  return `${base}.md`
}
