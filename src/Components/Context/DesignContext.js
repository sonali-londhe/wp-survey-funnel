import React, { createContext, useState, useEffect } from 'react';
import { initColorState } from '../../Data';
import fetchData from '../../HelperComponents/fetchData';

export function DesignContextProvider(props) {
	
	const [initialState, setinitialState] = useState(initColorState);
	const [selectedImage, setSelectedImage] = useState(null);
	const [selectedImageUrl, setSelectedImageUrl] = useState(null);

	const handleColorChange = (itemName, color) => {
		setinitialState({
			...initialState,
			[itemName]: color
		});
	}

	const handleRangeChange = ( value ) => {
		setinitialState({
			...initialState,
			opacity: value,
		})
	}

	useEffect(() => {
		const ajaxSecurity = document.getElementById('ajaxSecurity').value;
        const post_id = new URLSearchParams(window.location.search).get('post_id');
        const data = {
            security: ajaxSecurity,
            action: 'wpsf_get_design_data',
            post_id,
        };
        const ajaxURL = document.getElementById('ajaxURL').value;

		fetchData( ajaxURL, data )
		.then(data => {
			if ( data.data.design === '' ) {
				return;
			}
			const design = JSON.parse( data.data.design );
			setinitialState(design);
			setSelectedImageUrl(data.data.backgroundImage);
        });
	}, []);

	const changeHandler = (event) => {
		setSelectedImage(event.target.files[0]);
	};

	useEffect(() => {
		if ( selectedImage === null ) {
			return;
		}
		let allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
		if ( !allowedExtensions.exec(selectedImage.name) ) {
			setSelectedImage(null);
		}
	}, [selectedImage]);

	const saveContext = () => {
		const ajaxSecurity = document.getElementById('ajaxSecurity').value;
        const post_id = new URLSearchParams(window.location.search).get('post_id');
        const data = {
            security: ajaxSecurity,
            action: 'wpsf_save_design_data',
            post_id,
			state: JSON.stringify( { ...initialState } ),
        };
        const ajaxURL = document.getElementById('ajaxURL').value;

		fetchData( ajaxURL, data, selectedImage )
		.then(data => {
        });
	}

	return (
		<DesignContext.Provider
			value={{...initialState, handleColorChange, changeHandler, handleRangeChange, saveContext}}
		>
			{props.children}
		</DesignContext.Provider>
	);
}

export const DesignContext = createContext();