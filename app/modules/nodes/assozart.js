import sortBy from 'lodash/sortBy'

export default (store) => {
  const { activeUrlElements } = store
  // grab assozart as array and sort them by year
  let assozart = Array.from(store.table.assozart.values())
  // show only nodes of active ap
  const activeAp = store.activeUrlElements.ap
  assozart = assozart.filter(a => a.AaApArtId === activeAp)
  // map through all projekt and create array of nodes
  let nodes = assozart.map((el) => {
    let label = `...`
    const { adb_eigenschaften } = store.table
    if (adb_eigenschaften.size > 0) {
      if (el.AaSisfNr) {
        label = adb_eigenschaften.get(el.AaSisfNr).Artname
      } else {
        label = `(keine Art gewählt)`
      }
    }
    const projId = store.table.ap.get(el.AaApArtId).ProjId
    return {
      type: `row`,
      label,
      table: `assozart`,
      row: el,
      expanded: el.AaId === activeUrlElements.assozart,
      url: [`Projekte`, projId, `Arten`, el.AaApArtId, `assoziierte-Arten`, el.AaId],
    }
  })
  // filter by node.nodeLabelFilter
  const filterString = store.node.nodeLabelFilter.get(`assozart`)
  if (filterString) {
    nodes = nodes.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase())
    )
  }
  // sort by label and return
  return sortBy(nodes, `label`)
}
