import {dispatch, register} from '../dispatchers/app-dispatcher'
import AppConstants from '../constants/app-constants'
// importing from node
import { EventEmitter } from 'events'

// event broadcast each time there is a change to the store
const CHANGE_EVENT = 'change'

var _catalog = []

for ( let i = 1; i < 9; i++ ) {
	_catalog.push({
		'id': 'Thingy' + i,
		'title': 'Thingy #' +i,
		'summary': 'Neat Thingy',
		'description': 'Blah blah blah blah blah!! Blah blah blah.',
		'cost': i
	})
}

var cartItems = [];

const _removeItem = ( item ) => {
	_cartItems.splice(_cartItems.findIndex( i => i === item), 1)
}

const _findCartItem = ( item ) => {
	return _cartItems.find(_cartItems => _cartItems.id === item.id)
}

const _increaseItem = ( item ) => item.qty++;

const _decreaseItem = ( item ) => {
	item.qty--;
	if (item.qty === 0 ) {
		_removeItem( item )
	}
}

const _addItem = ( item ) => {
	const cartItem = _findCartItem( item );
	if ( !cartItem ) {
		_cartItems.push( Object.assign( {qty: 1}, item ));
	}
	else {
		_increaseItem( cartItem )
	}
}

const _cartTotals = ( qty = 0, total = 0) => {
	_cartItems.forEach( cartItem => {
		qty += cartItem.qty;
		total += cartItem.qty * cartItem.cost;
	})
	return {qty, total};
}

const AppStore = Object.assign(EventEmitter.prototype, {
	emitChange(){
		this.emit( CHANGE_EVENT )
	},
	addChangeListener( callback ) {
		this.on( CHANGE_EVENT, callback )
	},
	removeChangeListener( callback ) {
		this.removeListener( CHANGE_EVENT, callback )
	},
	getCart(){
		return _cartItems
	},
	//  returns
	getCatalog(){
		return _catalog.map(item => {
			return Object.assign( {}, item, _cartItems.find( cItem => cItem.id === item.id))
		})
	},
	getCartTotals() {
		return _cartTotals()
	},
	dispatcherIndex: register( function( action ){
		switch (action.actionType) {
			case AppConstants.ADD_ITEM:
				_addItem( action.item )
				break;
			case AppConstants.REMOVE_ITEM:
				_removeItem( action.item )
				break;
			case AppConstants.INCREASE_ITEM:
				_increaseItem( action.item )
				break;
			case AppConstants.DECREASE_ITEM:
				_decreaseItem( action.item )
				break;
		}
		AppStore.emitChange();
	})
})

export default AppStore