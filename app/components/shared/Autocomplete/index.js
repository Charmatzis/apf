import React, { Component, PropTypes } from 'react'
import { observer } from 'mobx-react'
import AutoComplete from 'material-ui/AutoComplete'

const Autocomplete = class Autocomplete extends Component { // eslint-disable-line react/prefer-stateless-function

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
        onNewRequest={(val) => {
          onChange(fieldName, val.id)
        }}
      />
    )
  }
}

Autocomplete.propTypes = {
  label: PropTypes.string.isRequired,
  fieldName: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  dataSource: PropTypes.arrayOf(PropTypes.object).isRequired,
  dataSourceConfig: PropTypes.shape({
    value: PropTypes.number,
    text: PropTypes.string,
  }),
  onChange: PropTypes.func.isRequired,
}

export default observer(Autocomplete)
