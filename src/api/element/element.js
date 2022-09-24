import faunadb from 'faunadb';
import { faunaClient} from '../../utils.js';

const {Create, Collection, Match, Index, Get, Ref, Paginate, Sum, Delete, Add, Select, Let, Var, Update} = faunadb.query;


export const getElements = async () => {

    const q = faunadb.query;
    const {Documents, Collection} = q;

    const result = await faunaClient
        .query(
            q.Map(
                Paginate(Documents(Collection('MDXElements'))),
                q.Lambda((x) => q.Get(x))
            )
        )

    return result   
}

export const getElement = async (id) => {

    const result = await faunaClient.query(
        Get(Ref(Collection('MDXElements'), id))
      )
    
    return result  
}

export const addElement = async (obj) => {

    const q = faunadb.query;

    const result = await faunaClient
        .query(
            Create(
                Collection('MDXElements'),
                { data: obj },
            )
        )
    
    return result
}

export const updateElement = async (obj) => {
    const q = faunadb.query;

    const result = await faunaClient
        .query(
            Update(
                Ref(Collection('MDXElements'), obj.id),
                { data: obj },
            )
        )
        
     return result   
}

export const deleteElement = async (id) => {

    const q = faunadb.query;

    const result = await faunaClient
        .query(
            Delete(Ref(Collection('MDXElements'), id))
        )
        
    return result    
}