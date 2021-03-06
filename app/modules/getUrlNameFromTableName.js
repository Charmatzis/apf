export default (table) => {
  const names = {
    ap: `Arten`,
    apber: `AP-Berichte`,
    apberuebersicht: `AP-Berichte`,
    assozart: `assoziierte-Arten`,
    beob: `Beobachtung`,
    beobzuordnung: `zugeordnete-Beobachtungen`,
    ber: `Berichte`,
    erfkrit: `AP-Erfolgskriterien`,
    idealbiotop: `Idealbiotop`,
    pop: `Populationen`,
    popber: `Kontroll-Berichte`,
    popmassnber: `Massnahmen-Berichte`,
    projekt: `Projekte`,
    tpop: `Teil-Populationen`,
    tpopber: `Kontroll-Berichte`,
    tpopkontr: `Kontrollen`,
    tpopkontrzaehl: `Zaehlungen`,
    tpopmassn: `Massnahmen`,
    tpopmassnber: `Massnahmen-Berichte`,
    user: `Benutzer`,
    userprojekt: `Benutzer-Projekte`,
    ziel: `AP-Ziele`,
    zielber: `Berichte`,
  }
  const name = names[table]
  if (!name) throw new Error(`Der Tabelle ${table} konnte kein Namen zugewiesen werden`)
  return name
}
