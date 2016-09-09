/*
 *
 * Formulare
 *
 */

import React, { Component } from 'react'
import app from 'ampersand-app'
import { Tabs, Tab } from 'material-ui/Tabs'
import styles from './styles.css'

export default class Formulare extends Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const store = app.store
    return (
      <div className={styles.container}>
        <Tabs>
          <Tab
            label="Daten"
            value="daten"
            className={styles.tab}
          />
          <Tab
            label="Filter"
            value="filter"
            className={styles.tab}
          />
          <Tab
            label="Strukturbaum"
            value="strukturbaum"
            className={styles.tab}
          />
        </Tabs>
      </div>
    )
  }
}
