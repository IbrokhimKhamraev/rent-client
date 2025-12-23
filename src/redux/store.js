import {combineReducers, configureStore} from "@reduxjs/toolkit"
import userReducer from './user/userSlice.js'
import {persistReducer, persistStore, createTransform} from 'redux-persist'
import storage from "redux-persist/lib/storage"

const rootReducer = combineReducers({user: userReducer})

const transformCircular = createTransform(
   (inboundState, key) => {return {...inboundState, mySet: [...inboundState.mySet]}},
   (outboundState, key) => {return {...outboundState, mySet: new Set(outboundState.mySet)}},
)

const persistConfig = {
   key: "rent-root",
   storage,
   version: 1,
   transforms: [transformCircular]
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
   reducer: persistedReducer,
   middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}),
})

export const persistor = persistStore(store)

