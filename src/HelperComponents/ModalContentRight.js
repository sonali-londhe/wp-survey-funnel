import React from "react";
import { convertToRgbaCSS, designBackground } from "./HelperFunctions";
import { useEffect } from "react";

export default function ModalContentRight( props ) {
	const { designCon, currentElement } = props;
	designBackground(designCon);

    useEffect(() => {
		if ( designCon.fontFamilyValue === '' ) {
			return;
		}
		let fontID = designCon.fontFamilyValue;
		if (!document.getElementById(fontID)) {
			var head = document.getElementsByTagName('head')[0];
			var link = document.createElement('link');
			link.id = fontID;
			link.rel = 'stylesheet';
			link.type = 'text/css';
			link.href = 'http://fonts.googleapis.com/css?family='+fontID;
			link.media = 'all';
			head.appendChild(link);
		}

	}, [designCon.fontFamilyValue])
	return (
        <div
            className="preview"
            style={{
                color: convertToRgbaCSS(designCon.fontColor),
                ...designCon.backgroundStyle,
                fontFamily: designCon.fontFamily,
            }}
        >
            <div
                className={`tab-list wpsf-tab-${currentElement}`}
                style={{
                    background: convertToRgbaCSS(
                        designCon.backgroundContainerColor
                    ),
                }}
            >
                <div className="tab-container">
                    <div className="tab" >
                        {props.children}
                    </div>
                </div>
            </div>
        </div>
    );
}
