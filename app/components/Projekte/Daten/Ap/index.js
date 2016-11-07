/*
 *
 * Population
 *
 */

import React, { Component, PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import mobX from 'mobx'
import styles from './styles.css'
import AutoComplete from 'material-ui/AutoComplete'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'

const Pop = class Pop extends Component { // eslint-disable-line react/prefer-stateless-function
  /*
  constructor() {
    super()
    // this.activeForm = this.activeForm.bind(this);
  }*/

  componentDidMount() {
    // fetch dropdown data
    const { store } = this.props
    store.fetchAeEigenschaften()
    store.fetchApStatus()
  }

  render() {
    const { store } = this.props
    const aeEigenschaften = mobX.toJS(store.data.aeEigenschaften)
    const apStati = mobX.toJS(store.data.apStatus)
    const ApArtId = (
      store.data.activeDataset
      && store.data.activeDataset.row
      && store.data.activeDataset.row.ApArtId ?
      store.data.activeDataset.row.ApArtId :
      null
    )
    let searchText = ''
    if (ApArtId && aeEigenschaften.length > 0) {
      searchText = aeEigenschaften.find(e => e.id === ApArtId).label
    }
    return (
      <div className={styles.container}>
        <AutoComplete
          hintText={store.data.aeEigenschaftenLoading ? 'lade Daten...' : ''}
          fullWidth
          floatingLabelText="Art"
          openOnFocus
          dataSource={aeEigenschaften}
          dataSourceConfig={{
            value: 'id',
            text: 'label',
          }}
          searchText={searchText}
          filter={AutoComplete.caseInsensitiveFilter}
          maxSearchResults={20}
          onNewRequest={(element) => {
            console.log('element clicked:', element)
          }}
        />
        <div className={styles.fieldContainer}>
          <div className={styles.label}>
            Aktionsplan
          </div>
          <RadioButtonGroup
            name="ApStatus"
            valueSelected={store.data.activeDataset.row.ApStatus}
            floatingLabelText="test"
            onChange={(e, v) => {
              // TODO: if clicked element is active value
              // set null
              console.log('e clicked:', e)
              console.log('v clicked:', v)
            }}
          >
            {
              apStati.map((e, index) =>
                <RadioButton
                  value={e.DomainCode}
                  label={e.DomainTxt}
                  key={index}
                />
              )
            }
          </RadioButtonGroup>
        </div>
      </div>
    )
  }
}

Pop.propTypes = {
  store: PropTypes.object,
}

export default inject('store')(observer(Pop))
