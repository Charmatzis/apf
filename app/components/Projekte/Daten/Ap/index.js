/*
 *
 * Population
 *
 */

import React, { Component, PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import mobX from 'mobx'
import styles from './styles.css'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

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
  }

  render() {
    const { store } = this.props
    const aeEigenschaften = mobX.toJS(store.data.aeEigenschaften)
    aeEigenschaften.unshift({
      label: '',
      id: null,
    })
    return (
      <div className={styles.container}>
        <SelectField
          hintText={store.data.aeEigenschaftenLoading.length === 0 ? 'lade Daten...' : ''}
          fullWidth
          floatingLabelText="Art"
          maxHeight={20}
          value={store.data.activeDataset.ApArtId}
          onChange={(element) => {
            console.log('element:', element)
          }}
        >
          {
            aeEigenschaften.map((e, index) =>
              <MenuItem value={e.id} primaryText={e.label} key={index} />
            )
          }
        </SelectField>
      </div>
    )
  }
}

Pop.propTypes = {
  store: PropTypes.object,
}

export default inject('store')(observer(Pop))