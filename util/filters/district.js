import hash from 'object-hash'
import { state_node } from '../../images'
import _ from 'lodash'
import dotProp from 'dot-prop-immutable'

export const addDistricts = (graph, patients) => {
  let districts = {}
 
  for (let patientId in patients) {
    if (!districts[hash(patients[patientId].district)]) {
        districts[hash(patients[patientId].district)] = patients[patientId].district
    }
  }

  for (var key in districts) {
    let node = {
      id: key,
      label: districts[key],
      size: 40,
      shape: 'image',
      image: state_node,
    }
    graph = dotProp.set(graph, 'nodes', list => [...list, node])
  }

  for (let patientId in patients) {
    let edge = {
      from: hash(patients[patientId].district),
      to: patients[patientId].patientId,
      length: 250,
      dashes: true,
      arrows: {
        to: {
          enabled: false,
        },
      },
      color: { opacity: '0.3' },
    }
    graph = dotProp.set(graph, 'edges', list => [...list, edge])
  }

  return graph
}

export const removeDistricts = (graph, patients) => {
  let districts = {}
  for (let patientId in patients) {
    if (!districts[hash(patients[patientId].district)]) {
        districts[hash(patients[patientId].district)] = patients[patientId].district
    }
  }
  for (var key in districts) {
    let node = {
      id: key,
      label: districts[key],
      size: 40,
      shape: 'image',
      image: state_node,
    }
    let index = _.findIndex(dotProp.get(graph, 'nodes'), function(o) {
      return o.id == key
    })

    if (index !== -1) {
      graph = dotProp.delete(graph, `nodes.${index}`)
    }
  }

  for (let patientId in patients) {
    let edge = {
      from: hash(patients[patientId].district),
      to: patients[patientId].patientId,
      length: 250,
      dashes: true,
      arrows: {
        to: {
          enabled: false,
        },
      },
      color: { opacity: '0.3' },
    }
    let edgeIndex = _.findIndex(graph.edges, function(o) {
      return (
        o.to == patients[patientId].patientId &&
        o.from === hash(patients[patientId].district)
      )
    })
    console.log('edge', edgeIndex)
    graph = dotProp.delete(graph, `edges.${edgeIndex}`)
  }

  return graph
}
