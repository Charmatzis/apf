/*
 *
 * Daten
 *
 */

import React, { Component, PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import styles from './styles.css'
import Pop from './Pop'

const Daten = class Daten extends Component { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super()
    this.activeForm = this.activeForm.bind(this)
  }
  activeForm() {
    const { store } = this.props
    if (!store.data.activeDataset || !store.data.activeDataset.table) {
      return <div></div>
    }
    switch (store.data.activeDataset.table) {
      case 'pop':
        return <Pop />
      default:
        return (
          store.data.activeDataset.row &&
          <div className={styles.container}>
            <p>Daten</p>
            <pre>
              {JSON.stringify(store.data.activeDataset, null, 2)}
            </pre>
          </div>
        )
    }
  }

  render() {
    return this.activeForm()
  }
}

Daten.propTypes = {
  store: PropTypes.object,
}

export default inject('store')(observer(Daten))
