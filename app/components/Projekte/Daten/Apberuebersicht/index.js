import React, { Component, PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import TextField from '../../../shared/TextField'
import styles from './styles.css'

@inject(`store`)
@observer
class Apberuebersicht extends Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    store: PropTypes.object,
  }

  render() {
    const { store } = this.props
    const activeNode = store.data.activeNode
    return (
      <div className={styles.container}>
        <TextField
          label="Jahr"
          fieldName="JbuJahr"
          value={activeNode.row.JbuJahr}
          errorText={activeNode.valid.JbuJahr}
          type="number"
          fullWidth={false}
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <TextField
          label="Bemerkungen"
          fieldName="JbuBemerkungen"
          value={activeNode.row.JbuBemerkungen}
          errorText={activeNode.valid.JbuBemerkungen}
          type="text"
          multiLine
          fullWidth
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
      </div>
    )
  }
}

export default Apberuebersicht