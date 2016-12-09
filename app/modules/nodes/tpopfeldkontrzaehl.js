import sortBy from 'lodash/sortBy'

export default ({ store, projId, apArtId, popId, tpopId, tpopkontrId }) => {
  const { activeUrlElements } = store
  // grab tpopkontrzaehl as array
  let tpopkontrzaehl = Array.from(store.table.tpopkontrzaehl.values())
  // show only nodes of active tpopkontr
  tpopkontrzaehl = tpopkontrzaehl.filter(a => a.TPopKontrId === tpopkontrId)

  // get zaehleinheitWerte
  const zaehleinheitWerte = Array.from(store.table.tpopkontrzaehl_einheit_werte.values())
  const methodeWerte = Array.from(store.table.tpopkontrzaehl_methode_werte.values())

  // map through all projekt and create array of nodes
  let nodes = tpopkontrzaehl.map((el) => {
    const zaehleinheitWert = zaehleinheitWerte.find(e => e.ZaehleinheitCode === el.Zaehleinheit)
    const zaehleinheitTxt = zaehleinheitWert ? zaehleinheitWert.ZaehleinheitTxt : null
    const methodeWert = methodeWerte.find(e => e.BeurteilCode === el.Methode)
    const methodeTxt = methodeWert ? methodeWert.BeurteilTxt : null

    return {
      menuType: `tpopfeldkontrzaehl`,
      id: el.TPopKontrZaehlId,
      label: `${el.Anzahl || `(keine Anzahl)`} ${zaehleinheitTxt || `(keine Einheit)`} (${methodeTxt || `keine Methode`})`,
      expanded: el.TPopKontrZaehlId === activeUrlElements.tpopfeldkontrzaehl,
      url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Teil-Populationen`, tpopId, `Feld-Kontrollen`, tpopkontrId, `Zaehlungen`, el.TPopKontrZaehlId],
    }
  })
  // filter by node.nodeLabelFilter
  const filterString = store.node.nodeLabelFilter.get(`tpopkontrzaehl`)
  if (filterString) {
    nodes = nodes.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase())
    )
  }
  // sort by label and return
  return sortBy(nodes, `label`)
}
