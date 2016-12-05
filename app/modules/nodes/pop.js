import sortBy from 'lodash/sortBy'
import massnberNodes from './popmassnber'
import popberNodes from './popber'
import tpopNodes from './tpop'

export default (store, apArtId) => {
  const { activeUrlElements } = store
  // grab pop as array and sort them by year
  let pop = Array.from(store.table.pop.values())
  // show only nodes of active ap
  pop = pop.filter(a => a.ApArtId === apArtId)
  pop = sortBy(pop, `PopNr`)
  // map through all projekt and create array of nodes
  let nodes = pop.map((el) => {
    const projId = store.table.ap.get(el.ApArtId).ProjId
    const myMassnberNodes = massnberNodes({ store, projId, apArtId: el.ApArtId, popId: el.PopId })
    const myPopberNodes = popberNodes({ store, projId, apArtId: el.ApArtId, popId: el.PopId })
    const myTpopNodes = tpopNodes({ store, projId, apArtId: el.ApArtId, popId: el.PopId })
    return {
      type: `row`,
      label: `${el.PopNr || `(keine Nr)`}: ${el.PopName || `(kein Name)`}`,
      table: `pop`,
      row: el,
      expanded: el.PopId === activeUrlElements.pop,
      url: [`Projekte`, projId, `Arten`, el.ApArtId, `Populationen`, el.PopId],
      children: [
        {
          type: `folder`,
          label: `Teil-Populationen (${myTpopNodes.length})`,
          table: `pop`,
          row: `el`,
          expanded: activeUrlElements.tpopFolder,
          url: [`Projekte`, projId, `Arten`, el.ApArtId, `Populationen`, el.PopId, `Teil-Populationen`],
          children: myTpopNodes,
        },
        {
          type: `folder`,
          label: `Kontroll-Berichte (${myPopberNodes.length})`,
          table: `pop`,
          row: `el`,
          expanded: activeUrlElements.popberFolder,
          url: [`Projekte`, projId, `Arten`, el.ApArtId, `Populationen`, el.PopId, `Kontroll-Berichte`],
          children: myPopberNodes,
        },
        {
          type: `folder`,
          label: `Massnahmen-Berichte (${myMassnberNodes.length})`,
          table: `pop`,
          row: `el`,
          expanded: activeUrlElements.popmassnberFolder,
          url: [`Projekte`, projId, `Arten`, el.ApArtId, `Populationen`, el.PopId, `Massnahmen-Berichte`],
          children: myMassnberNodes,
        },
      ],
    }
  })
  // filter by node.nodeLabelFilter
  const filterString = store.node.nodeLabelFilter.get(`pop`)
  if (filterString) {
    nodes = nodes.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase())
    )
  }
  // sort by label and return
  return nodes
}
