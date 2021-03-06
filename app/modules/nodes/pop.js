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
      nodeType: `table`,
      menuType: `pop`,
      id: el.PopId,
      parentId: el.ApArtId,
      label: `${el.PopNr || `(keine Nr)`}: ${el.PopName || `(kein Name)`}`,
      expanded: el.PopId === activeUrlElements.pop,
      url: [`Projekte`, projId, `Arten`, el.ApArtId, `Populationen`, el.PopId],
      children: [
        {
          nodeType: `folder`,
          menuType: `tpopFolder`,
          id: el.PopId,
          label: `Teil-Populationen (${myTpopNodes.length})`,
          expanded: activeUrlElements.tpopFolder,
          url: [`Projekte`, projId, `Arten`, el.ApArtId, `Populationen`, el.PopId, `Teil-Populationen`],
          children: myTpopNodes,
        },
        {
          nodeType: `folder`,
          menuType: `popberFolder`,
          id: el.PopId,
          label: `Kontroll-Berichte (${myPopberNodes.length})`,
          expanded: activeUrlElements.popberFolder,
          url: [`Projekte`, projId, `Arten`, el.ApArtId, `Populationen`, el.PopId, `Kontroll-Berichte`],
          children: myPopberNodes,
        },
        {
          nodeType: `folder`,
          menuType: `popmassnberFolder`,
          id: el.PopId,
          label: `Massnahmen-Berichte (${myMassnberNodes.length})`,
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
