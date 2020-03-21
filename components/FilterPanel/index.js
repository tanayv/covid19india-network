import React from 'react'
import styled from 'styled-components'

import { connect } from 'react-redux'
import _ from 'lodash'

import { state, city, abroad, p2p } from '../../images/index'
import { addStates, removeStates } from '../../util/filters/state'
import { addDistricts, removeDistricts } from '../../util/filters/district'

import { updateGraph } from '../Redux/actions'

const filters = [
  {
    name: 'P2P',
    icon: p2p,
    add: graph => {
      return graph
    },
    remove: graph => {
      return graph
    },
  },
  { name: 'State', icon: state, add: addStates, remove: removeStates },
  { name: 'District', icon: state, add: addDistricts, remove: removeDistricts },
]

const HeaderContainer = styled.div`
  padding-top: 10px;
  background-color: #f2f2f2;
  display: grid;
  grid-template-rows: 7% 93%;
  overflow: auto;
  font-family: 'Lato', sans-serif;
  color: #7c7a7a;
  font-weight: bold;

  @media screen and (max-width: 768px) {
    grid-template-rows: 1fr;
    grid-template-columns: 20% 80%;
    padding-top: 0;
  }
`

const FilterMenuContainer = styled.div`
  display: grid;
  grid-template-rows: 10% 10% 10% 70%;
  overflow: auto;
  font-family: 'Lato', sans-serif;
  color: #7c7a7a;
  font-weight: bold;

  @media screen and (max-width: 768px) {
    grid-template-rows: 1fr;
    grid-template-columns: 20% 20% 20% 40%;
  }
`

const FilterCategory = ({ filter, onClick, selected }) => {
  const FilterContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    height: '20vh';
    user-select: none;
    background-color: ${props => (props.selected ? '#d6d6d6' : '#F2F2F2')};
    transition: all 0.2s ease-out;
    cursor: pointer;
    &:hover {
      background-color: #d7d7d7;
    }
  `
  const FilterName = styled.div`
    text-transform: uppercase;
    font-size: 11px;
  `

  const FilterIcon = styled.img`
    width: 40px;
  `

  return (
    <FilterContainer onClick={onClick} selected={selected}>
      <FilterIcon src={filter.icon} />
      <FilterName>{filter.name}</FilterName>
    </FilterContainer>
  )
}

const FilterPanel = ({ graph, patients, updateGraph }) => {
  const [selected, selectCategory] = React.useState('P2P')
  const changeGraph = name => {
    // console.log('Changegraph', graph, patients.byId)
    let currentFilter = _.find(filters, function(o) {
      return o.name === selected
    })
    let choosenFilter = _.find(filters, function(o) {
      return o.name === name
    })

    let newGraph = currentFilter.remove(graph, patients.byId)

    selectCategory(name)
    newGraph = choosenFilter.add(newGraph, patients.byId)
    console.log(newGraph)
    updateGraph(newGraph)
  }
  const FilterHeader = styled.div`
    text-align: center;
    text-transform: uppercase;
    font-size: 14px;

    @media screen and (max-width: 768px) {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `
  return (
    <HeaderContainer>
      <FilterHeader>Cluster Filter</FilterHeader>
      <FilterMenuContainer>
        {filters.map(filter => (
          <FilterCategory
            filter={filter}
            onClick={() => changeGraph(filter.name)}
            selected={selected === filter.name ? true : false}
          />
        ))}
      </FilterMenuContainer>
    </HeaderContainer>
  )
}

const mapStateToProps = state => {
  const { patients } = state
  const { graph } = state
  return { graph, patients }
}

export default connect(mapStateToProps, { updateGraph })(FilterPanel)
