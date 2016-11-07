import React, { Component, PropTypes } from 'react'
import { observer } from 'mobx-react'
import AutoComplete from 'material-ui/AutoComplete'
import styles from './styles.css'

const Autocomplete = class Autocomplete extends Component { // eslint-disable-line react/prefer-stateless-function

  constructor() {
    super()

  }

  render() {
    const {
      label,
      fieldName,
      value = ``,
      dataSource,
      dataSourceConfig = {
        value: `id`,
        text: `label`,
      },
      onChange,
    } = this.props
    let searchText = ``
    if (value && dataSource.length > 0) {
      searchText = dataSource.find(e => e.id === value).label
    }
    return (
      <AutoComplete
        hintText={dataSource.length === 0 ? `lade Daten...` : ``}
        fullWidth
        floatingLabelText={label}
        openOnFocus
        dataSource={dataSource}
        dataSourceConfig={dataSourceConfig}
        searchText={searchText}
        filter={AutoComplete.caseInsensitiveFilter}
        maxSearchResults={20}
        onNewRequest={(value) => {
          console.log(`value clicked:`, value.id)
          onChange(fieldName, value.id)
        }}
      />
    )
  }
}

Autocomplete.propTypes = {
  label: PropTypes.string,
  fieldName: PropTypes.string,
  value: PropTypes.number,
  dataSource: PropTypes.array,
  dataSourceConfig: PropTypes.object,
  onChange: PropTypes.func,
}

export default observer(Autocomplete)
