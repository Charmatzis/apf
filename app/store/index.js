/**
 * Note: we are using singleton to make sure that it's one instance only,
 * because the store can be used outside react components, eg. routes.js
 * from: http://stackoverflow.com/questions/35850871/how-to-connect-state-to-props-with-mobx-js-observer-when-use-es6-class/36164488#36164488
 */
/* eslint-disable no-console, no-param-reassign */

import { action, reaction, autorun, transaction, computed, toJS, observable } from 'mobx'
import singleton from 'singleton'
import axios from 'axios'
import objectValues from 'lodash/values'
import forEach from 'lodash/forEach'
import sortBy from 'lodash/sortBy'
import createHistory from 'history/createBrowserHistory'

import fetchTableModule from './fetchTable'
import fetchTableByParentId from './fetchTableByParentId'
// import getNodeByPath from '../modules/getNodeByPath'
import apiBaseUrl from '../modules/apiBaseUrl'
import fetchDataset from '../modules/fetchDataset'
import tables from '../modules/tables'
// import countRowsAboveActiveNode from '../modules/countRowsAboveActiveNode'
import getActiveDatasetFromUrl from '../modules/getActiveDatasetFromUrl'
import storeIsNew from '../modules/storeIsNew'
import getActiveUrlElements from '../modules/getActiveUrlElements'

import NodeStore from './node'
import UiStore from './ui'
import AppStore from './app'
import TableStore from './table'

class Store extends singleton {
  constructor() {
    super()
    this.fetchFields = this.fetchFields.bind(this)
    this.updateProperty = this.updateProperty.bind(this)
    this.updatePropertyInDb = this.updatePropertyInDb.bind(this)
    this.fetchTable = this.fetchTable.bind(this)
    this.toggleNode = this.toggleNode.bind(this)
    this.fetchNodeChildren = this.fetchNodeChildren.bind(this)
  }

  @observable history = createHistory()
  node = NodeStore
  ui = UiStore
  app = AppStore
  table = TableStore

  @computed get url() {
    const pathNamePassed = this.history.location.pathname
    const pathName = pathNamePassed.replace(`/`, ``)
    const pathElements = pathName.split(`/`)
    if (pathElements[0] === ``) {
      // get rid of empty element(s) at start
      pathElements.shift()
    }
    return pathElements
  }

  forwardToProjekte = autorun(
    () => {
      const { history } = this
      if (this.history.location.pathname === `/`) {
        // forward / to /Projekte
        history.push(`Projekte`)
      }
    }
  )

  updateActiveUrlElements = autorun(
    () => {
      this.activeUrlElements = getActiveUrlElements(this.url)
    }
  )

  @observable activeUrlElements

  updateData = autorun(
    () => {
      // if new store, fetch all nodes
      if (storeIsNew(this)) {
        this.node.loadingAllNodes = true
        const activeElements = this.activeUrlElements
        const store = this
        const fetchingFromActiveElements = {
          projektFolder() {
            return fetchTableModule(store, `apflora`, `projekt`)
          },
          apberuebersichtFolder() {
            return fetchTableByParentId(store, `apflora`, `apberuebersicht`, activeElements.projekt)
          },
          apFolder() {
            return fetchTableByParentId(store, `apflora`, `ap`, activeElements.projekt)
          },
          assozartFolder() {
            return fetchTableByParentId(store, `apflora`, `assozart`, activeElements.ap)
          },
          idealbiotopFolder() {
            return fetchTableByParentId(store, `apflora`, `idealbiotop`, activeElements.ap)
          },
          beobNichtZuzuordnenFolder() {
            // TODO
            return fetchTableByParentId(store, `apflora`, `ap`, activeElements.projekt)
          },
          beobzuordnungFolder() {
            // TODO
            return fetchTableByParentId(store, `apflora`, `ap`, activeElements.projekt)
          },
          berFolder() {
            return fetchTableByParentId(store, `apflora`, `ber`, activeElements.ap)
          },
          apberFolder() {
            return fetchTableByParentId(store, `apflora`, `apber`, activeElements.ap)
          },
          erfkritFolder() {
            return fetchTableByParentId(store, `apflora`, `erfkrit`, activeElements.ap)
          },
          zielFolder() {
            return fetchTableByParentId(store, `apflora`, `ziel`, activeElements.ap)
          },
          zielberFolder() {
            return fetchTableByParentId(store, `apflora`, `zielber`, activeElements.ziel)
          },
          popFolder() {
            return fetchTableByParentId(store, `apflora`, `pop`, activeElements.ap)
          },
          popberFolder() {
            return fetchTableByParentId(store, `apflora`, `popber`, activeElements.pop)
          },
          popmassnberFolder() {
            return fetchTableByParentId(store, `apflora`, `popmassnber`, activeElements.pop)
          },
          tpopFolder() {
            return fetchTableByParentId(store, `apflora`, `tpop`, activeElements.pop)
          },
          tpopmassnFolder() {
            return fetchTableByParentId(store, `apflora`, `tpopmassn`, activeElements.tpop)
          },
          tpopmassnberFolder() {
            return fetchTableByParentId(store, `apflora`, `tpopmassnber`, activeElements.tpop)
          },
          tpopfeldkontrFolder() {
            return fetchTableByParentId(store, `apflora`, `tpopkontr`, activeElements.tpop)
          },
          tpopkontrzaehlFolder() {
            return fetchTableByParentId(store, `apflora`, `tpopkontrzaehl`, activeElements.tpopfeldkontr)
          },
          tpopfreiwkontrFolder() {
            return fetchTableByParentId(store, `apflora`, `tpopkontr`, activeElements.tpop)
          },
          tpopberFolder() {
            return fetchTableByParentId(store, `apflora`, `tpopber`, activeElements.tpop)
          },
          tpopBeobzuordnungFolder() {
            // TODO
            return fetchTableByParentId(store, `apflora`, `ap`, activeElements.tpop)
          },
        }
        console.log(`reaction updateData: fetchingFromActiveElements:`, fetchingFromActiveElements)
        console.log(`reaction updateData: activeElements:`, activeElements)
        forEach(fetchingFromActiveElements, (func, key) => {
          if (activeElements[key]) func()
        })
      } else {
        // else if url longer: load new table
        // get previous pathname
        console.log(`this.history:`, this.history)
      }


      // else dont load data
    }
  )

  @action
  fetchFields = () => {
      // only fetch if not yet done
    if (this.app.fields.length === 0 && !this.app.fieldsLoading) {
      this.app.fieldsLoading = true
      axios.get(`${apiBaseUrl}/felder`)
        .then(({ data }) => {
          transaction(() => {
            this.app.fields = data
            this.app.fieldsLoading = false
          })
        })
        .catch(error => console.log(`error fetching fields:`, error))
    }
  }

  @action
  updateLabelFilter = (table, value) => {
    if (!table) return console.log(`nodeLabelFilter cant be updated: no table passed`)
    this.node.nodeLabelFilter[table] = value
  }

  @action
  updateProperty = (key, value) => {
    const { table, row } = this.activeDataset
    // ensure primary data exists
    if (!key || !table || !row) {
      return console.log(`change was not saved: field: ${key}, table: ${table}, value: ${value}`)
    }
    row[key] = value
  }

  @action
  updatePropertyInDb = (key, value) => {
    const { table, row, valid } = this.activeDataset

    // ensure primary data exists
    if (!key || !table || !row) {
      return
    }

    // ensure derived data exists
    const tabelle = tables.find(t => t.table === table)
    const idField = tabelle ? tabelle.idField : undefined
    if (!idField) {
      return console.log(`change was not saved: field: ${key}, table: ${table}, value: ${value}`)
    }
    const tabelleId = row[idField] || undefined
    if (!tabelleId) {
      return console.log(`change was not saved: field: ${key}, table: ${table}, value: ${value}`)
    }

    // update if no validation messages exist
    const combinedValidationMessages = objectValues(valid).join(``)
    // console.log(`updatePropertyInDb, combinedValidationMessages:`, combinedValidationMessages)
    if (combinedValidationMessages.length === 0) {
      const { user } = this.app
      const oldValue = row[key]
      row[key] = value
      axios.put(`${apiBaseUrl}/update/apflora/tabelle=${table}/idField=${idField}/tabelleId=${tabelleId}/feld=${key}/wert=${value}/user=${user}`)
        .catch((error) => {
          row[key] = oldValue
          this.app.errors.unshift(error)
          setTimeout(() => {
            this.app.errors.pop()
          }, 1000 * 10)
          console.log(`change was not saved: field: ${key}, table: ${table}, value: ${value}`)
        })
    }
  }

  @action
  fetchTable = (schemaName, tableName) => {
    fetchTableModule(this, schemaName, tableName)
  }

  @action
  fetchTableByParentId = (schemaName, tableName, parentId) => {
    fetchTableByParentId(this, schemaName, tableName, parentId)
  }

  @action
  toggleNode = (node) => {
    if (node) {
      const wasClosed = !node.expanded
      transaction(() => {
        // TODO
        node.expanded = !node.expanded
        if (this.node.activeNode !== node) {
          this.node.activeNode = node
        }
      })
      if (
        wasClosed
        && node.children
        && node.children.length
        && (
          node.children[0] === 0
          || (node.children[0].label && node.children[0].label === `lade Daten...`)
        )
      ) {
        transaction(() => {
          node.children.replace([{
            nodeId: `${node.nodeId}0`,
            label: `lade Daten...`,
            expanded: false,
            children: [],
          }])
        })
        this.fetchNodeChildren(node)
      }
    }
  }

  @action
  fetchNodeChildren = (node) => {
    let id
    if (node.id) {
      id = node.id
    } else {
      const table = tables.find(t => t.table === node.table)
      if (!table) throw new Error(`table not found`)
      const idField = table.idField
      id = node.row[idField]
    }
    axios.get(`${apiBaseUrl}/node?table=${node.table}&id=${id}&folder=${node.folder ? node.folder : ``}`)
      .then(({ data: nodes }) => {
        transaction(() => {
          node.children.replace(nodes)
        })
      })
      .catch(error =>
        console.log(`action fetchNodeChildren: Error fetching node children:`, error
      ))
  }

  updateActiveDataset = autorun(
    () => {
      this.activeDataset = getActiveDatasetFromUrl(this)
    }
  )
  @observable activeDataset

  @computed get projektNodes() {
    // grab projekte as array and sort them by name
    const projekte = sortBy(Array.from(this.table.projekt.values()), `ProjName`)
    const activeElements = this.activeUrlElements

    // map through all projekt and create array of nodes
    return projekte.map(el => ({
      type: `row`,
      label: el.ProjName || `(kein Name)`,
      table: `projekt`,
      row: el,
      expanded: el.ProjId === activeElements.projekt,
      url: [`Projekte`, el.ProjId],
      children: [
        {
          type: `folder`,
          label: `Arten (${this.apNodes.length})`,
          folder: `ap`,
          table: `projekt`,
          row: el,
          expanded: activeElements.apFolder,
          url: [`Projekte`, el.ProjId, `Arten`],
          children: this.apNodes,
        },
        {
          type: `folder`,
          label: `AP-Berichte (${this.apberuebersichtNodes.length})`,
          folder: `apberuebersicht`,
          table: `projekt`,
          row: el,
          id: el.ProjId,
          expanded: activeElements.apberuebersichtFolder,
          url: [`Projekte`, el.ProjId, `AP-Berichte`],
          children: this.apberuebersichtNodes,
        },
      ],
    }))
  }

  @computed get apberuebersichtNodes() {
    // grab apberuebersicht as array and sort them by year
    const apberuebersicht = sortBy(Array.from(this.table.apberuebersicht.values()), `JbuJahr`)
    const { activeUrlElements } = this
    // map through all projekt and create array of nodes
    return apberuebersicht.map(el => ({
      type: `row`,
      label: el.JbuJahr,
      table: `apberuebersicht`,
      row: el,
      expanded: el.JbuJahr === activeUrlElements.apberuebersicht,
      url: [`Projekte`, el.ProjId, `AP-Berichte`, el.JbuJahr],
    }))
  }

  @computed get apNodes() {
    // grab ape as array and sort them by name
    const ap = Array.from(this.table.ap.values())
    const activeElements = this.activeUrlElements
    // map through all ap and create array of nodes
    const nodes = ap.map(el => ({
      type: `row`,
      label() {
        let artname = `(kein Name)`
        const aeEigenschaften = toJS(this.data.adb_eigenschaften)
        if (aeEigenschaften.size > 0) {
          artname = aeEigenschaften.get(el.ApArtId).Artname
        }
        return artname
      },
      table: `ap`,
      row: el,
      expanded: el.ApArtId === activeElements.ap,
      url: [`Projekte`, el.ProjId, `Arten`, el.ApArtId],
      children: [
        // pop folder
        {
          type: `folder`,
          label: `Populationen. TODO: add number`,
          table: `ap`,
          row: el,
          id: el.ApArtId,
          expanded: activeElements.popFolder,
          url: [`Projekte`, el.ProjId, `Arten`, el.ApArtId, `Populationen`],
          children: [],
        },
        // ziel folder
        {
          type: `folder`,
          label: `AP-Ziele. TODO: add number`,
          table: `ap`,
          row: el,
          id: el.ApArtId,
          expanded: activeElements.zielFolder,
          url: [`Projekte`, el.ProjId, `Arten`, el.ApArtId, `AP-Ziele`],
          children: [],
        },
        // erfkrit folder
        {
          type: `folder`,
          label: `AP-Erfolgskriterien. TODO: add number`,
          table: `ap`,
          row: el,
          id: el.ApArtId,
          expanded: activeElements.erfkritFolder,
          url: [`Projekte`, ap.ProjId, `Arten`, ap.ApArtId, `AP-Erfolgskriterien`],
          children: [],
        },
        // apber folder
        {
          type: `folder`,
          label: `AP-Berichte. TODO: add number`,
          table: `ap`,
          row: el,
          id: el.ApArtId,
          expanded: activeElements.apberFolder,
          url: [`Projekte`, ap.ProjId, `Arten`, ap.ApArtId, `AP-Berichte`],
          children: [],
        },
        // ber folder
        {
          type: `folder`,
          label: `Berichte. TODO: add number`,
          table: `ap`,
          row: el,
          id: el.ApArtId,
          expanded: activeElements.berFolder,
          url: [`Projekte`, ap.ProjId, `Arten`, ap.ApArtId, `Berichte`],
          children: [],
        },
        // beobNichtBeurteilt folder
        {
          type: `folder`,
          label: `nicht beurteilte Beobachtungen. TODO: add number`,
          table: `ap`,
          row: el,
          id: el.ApArtId,
          expanded: activeElements.beobzuordnungFolder,
          url: [`Projekte`, ap.ProjId, `Arten`, ap.ApArtId, `nicht-beurteilte-Beobachtungen`],
          children: [],
        },
        // beobNichtZuzuordnen folder
        {
          type: `folder`,
          label: `nicht zuzuordnende Beobachtungen. TODO: add number`,
          table: `ap`,
          row: el,
          id: el.ApArtId,
          expanded: activeElements.beobNichtZuzuordnenFolder,
          url: [`Projekte`, ap.ProjId, `Arten`, ap.ApArtId, `nicht-zuzuordnende-Beobachtungen`],
          children: [],
        },
        // idealbiotop folder
        {
          type: `folder`,
          label: `Idealbiotop`,
          table: `idealbiotop`,
          row: el,
          id: el.ApArtId,
          expanded: activeElements.idealbiotopFolder,
          url: [`Projekte`, ap.ProjId, `Arten`, ap.ApArtId, `Idealbiotop`],
          children: [],
        },
        // assozarten folder
        {
          type: `folder`,
          label: `assoziierte Arten. TODO: add number`,
          table: `ap`,
          row: el,
          id: el.ApArtId,
          expanded: activeElements.assozartFolder,
          url: [`Projekte`, ap.ProjId, `Arten`, ap.ApArtId, `assoziierte-Arten`],
          children: [],
        },
        // qk folder
        {
          type: `folder`,
          label: `Qualitätskontrollen`,
          table: `ap`,
          row: el,
          id: el.ApArtId,
          expanded: false,
          url: [`Projekte`, el.ProjId, `Arten`, el.ApArtId, `Qualitätskontrollen`],
        },
      ],
    }))
    // sort by label and return
    return sortBy(nodes, `label`)
  }
}

export default Store.get()
