/* eslint-disable camelcase */
import { observable, asMap, map, computed, toJS } from 'mobx'

// TODO: apply asMap

class Table {
  @observable adb_eigenschaften = map()
  @observable adb_eigenschaftenLoading = false
  @computed get artname() {
    const aeEigenschaften = toJS(this.adb_eigenschaften)
    let artname = ``
    if (this.activeNode.row && this.activeNode.row.ApArtId && aeEigenschaften.size > 0) {
      artname = aeEigenschaften.get(this.activeNode.row.ApArtId).Artname
    }
    return artname
  }
  @observable adb_lr = map()
  @observable adb_lrLoading = false
  @observable adresse = map()
  @observable adresseLoading = false
  @observable ap = map()
  @observable apLoading = false
  @observable ap_bearbstand_werte = map()
  @observable ap_bearbstand_werteLoading = false
  @observable ap_erfbeurtkrit_werte = map()
  @observable ap_erfbeurtkrit_werteLoading = false
  @observable ap_erfkrit_werte = map()
  @observable ap_erfkrit_werteLoading = false
  @observable ap_umsetzung_werte = map()
  @observable ap_umsetzung_werteLoading = false
  @observable apber = map()
  @observable apberLoading = false
  @observable apberuebersicht = map()
  @observable apberuebersichtLoading = false
  @observable assozart = map()
  @observable assozartLoading = false
  @observable beob_bereitgestellt = map()
  @observable beob_bereitgestelltLoading = false
  @observable beob_evab = map()
  @observable beob_evabLoading = false
  @observable beob_infospezies = map()
  @observable beob_infospeziesLoading = false
  @observable beob_projekt = map()
  @observable beob_projektLoading = false
  @observable beob_quelle = map()
  @observable beob_quelleLoading = false
  @observable beobzuordnung = map()
  @observable beobzuordnungLoading = false
  @observable ber = map()
  @observable berLoading = false
  @observable erfkrit = map()
  @observable erfkritLoading = false
  @observable evab_tbl_personen = map()
  @observable evab_tbl_personenLoading = false
  @observable flora_status_werte = map()
  @observable flora_status_werteLoading = false
  @observable gemeinde = map()
  @observable gemeindeLoading = false
  @observable idealbiotop = map()
  @observable idealbiotopLoading = false
  @observable pop = map()
  @observable popLoading = false
  @observable pop_entwicklung_werte = map()
  @observable pop_entwicklung_werteLoading = false
  @observable pop_status_werte = map()
  @observable pop_status_werteLoading = false
  @observable popber = map()
  @observable popberLoading = false
  @observable popmassnber = map()
  @observable popmassnberLoading = false
  @observable projekt = map()
  @observable projektLoading = false
  @observable tpop = map()
  @observable tpopLoading = false
  @observable tpop_apberrelevant_werte = map()
  @observable tpop_apberrelevant_werteLoading = false
  @observable tpop_entwicklung_werte = map()
  @observable tpop_entwicklung_werteLoading = false
  @observable tpopber = map()
  @observable tpopberLoading = false
  @observable tpopkontr = map()
  @observable tpopkontrLoading = false
  @observable tpopkontr_idbiotuebereinst_werte = map()
  @observable tpopkontr_idbiotuebereinst_werteLoading = false
  @observable tpopkontr_typ_werte = map()
  @observable tpopkontr_typ_werteLoading = false
  @observable tpopkontrzaehl = map()
  @observable tpopkontrzaehlLoading = false
  @observable tpopkontrzaehl_einheit_werte = map()
  @observable tpopkontrzaehl_einheit_werteLoading = false
  @observable tpopkontrzaehl_methode_werte = map()
  @observable tpopkontrzaehl_methode_werteLoading = false
  @observable tpopmassn = map()
  @observable tpopmassnLoading = false
  @observable tpopmassn_erfbeurt_werte = map()
  @observable tpopmassn_erfbeurt_werteLoading = false
  @observable tpopmassn_typ_werte = map()
  @observable tpopmassn_typ_werteLoading = false
  @observable tpopmassnber = map()
  @observable tpopmassnberLoading = false
  @observable user = map()
  @observable userLoading = false
  @observable userprojekt = map()
  @observable userprojektLoading = false
  @observable ziel = map()
  @observable zielLoading = false
  @observable ziel_typ_werte = map()
  @observable ziel_typ_werteLoading = false
  @observable zielber = map()
  @observable zielberLoading = false
}

export default new Table()
