import React from "react";
import { formElements, formElementsDropBoard } from "../../../../Data";
import Tabs from "../../../../HelperComponents/Tabs";
import BuildFormElement from "./BuildFormElement";
import DropFormBoard from "./DropFormBoard";
import update from "immutability-helper";
import ModalContentRight from "../../../../HelperComponents/ModalContentRight";
import { convertToRgbaCSS } from "../../../../HelperComponents/HelperFunctions";
import { CloseModal } from '../../../../HelperComponents/CloseModalPopUp';

export const FormElements = React.memo(
    class extends React.Component {
        constructor(props) {
            super(props);
        }
        state = {
            title: "",
            description: "",
            currentFormElement: null,
            buttonLabel: '',
            List: [],
        };

        handleChange = (event) => {
            this.setState({
                [event.target.name]: event.target.value,
            });
        };

        setCurrentFormElement = (element) => {
            document
                .querySelectorAll(".wpsf-build-container .tab-list-item")[1]
                .click();
            this.setState({
                currentFormElement: element,
            });
        };

        addToList = (item) => {
            let newList = this.state.List.slice();
            item.id = this.generateId();
            newList.push(item);
            this.setState({
                List: newList,
            });
        };

        generateId = () => {
            return (
                Math.random().toString(36).substring(2) +
                new Date().getTime().toString(36) +
                "_form"
            );
        };

        componentDidMount() {
            const { currentElement } = this.props;
            if ("currentlySaved" in currentElement) {
                let state = {
                    title: currentElement.title,
                    description: currentElement.description,
                    buttonLabel: currentElement.buttonLabel,
                    List: currentElement.List,
                };
                this.setState(state);
            }
        }

        getCurrentFormElementLeftRender = () => {
            let index = null;
            for (let i = 0; i < this.state.List.length; i++) {
                if (
                    this.state.currentFormElement.id === this.state.List[i].id
                ) {
                    index = i;
                }
            }

            if (index === null) {
                return "";
            }
            const { currentFormElement, List } = this.state;
            switch (currentFormElement.componentName) {
                case "FirstName":
                case "LastName":
                case "Email":
                case "ShortTextAnswer":
                case "LongTextAnswer":
                    return (
                        <div className="modalComponentFormFields">
                            <h3>Label Name</h3>
                            <input
                                type="text"
                                name="name"
                                value={List[index].name}
                                data-attr={index}
                                onChange={(e) => {
                                    this.handleInputChange(e);
                                }}
                            />

                            <h3>Placeholder</h3>
                            <input
                                type="text"
                                name="placeholder"
                                value={List[index].placeholder}
                                data-attr={index}
                                onChange={(e) => {
                                    this.handleInputChange(e);
                                }}
                            />
                            <div className="wpsf-required-field-container">
                                <h3>Mark field Required</h3>
                                <input
                                    type="checkbox"
                                    name="required"
                                    data-attr={index}
                                    onChange={(e) => {
                                        this.handleCheckboxChange(e);
                                    }}
                                    checked={List[index].required}
                                />

                            </div>

                        </div>
                    );
            }
        };

        handleCheckboxChange = (e) => {
            let newList = JSON.parse(JSON.stringify(this.state.List));
            let key = e.target.name;
            let value = e.target.checked;
            let index = e.target.getAttribute("data-attr");
            newList[index][key] = value;
            this.setState({
                List: newList,
            });
        }

        getCurrentFormElementRightRender = (ele, index) => {
            const { List } = this.state;
            const { designCon } = this.props;
            switch (ele.componentName) {
                case "FirstName":
                case "LastName":
                case "Email":
                case "ShortTextAnswer":
                    return (
                        <div key={ele.id}>
                            <label>{List[index].name}</label>
                            <input
                                type="text"
                                name="name"
                                placeholder={List[index].placeholder}
                                style={{ border: `1px solid ${convertToRgbaCSS(designCon.answerBorderColor)}` }}
                            />
                        </div>
                    );
                case "LongTextAnswer":
                    return (
                        <div key={ele.id}>
                            <label>{List[index].name}</label>
                            <textarea
                                type="text"
                                name="name"
                                placeholder={List[index].placeholder}
                                style={{ border: `1px solid ${convertToRgbaCSS(designCon.answerBorderColor)}` }}
                            />
                        </div>
                    );
            }
        };

        editList = (ele) => {
            this.setCurrentFormElement(ele);
        };

        deleteFromList = (index) => {
            const newList = this.state.List.slice();
            newList.splice(index, 1);

            this.setState({
                List: newList,
            });
        };

        handleInputChange = (e) => {
            let newList = JSON.parse(JSON.stringify(this.state.List));
            let key = e.target.name;
            let value = e.target.value;
            let index = e.target.getAttribute("data-attr");
            newList[index][key] = value;
            this.setState({
                List: newList,
            });
        };

        moveCard = (dragIndex, hoverIndex, data) => {
            const dragCard = this.state.List[dragIndex];
            const newList = this.state.List.slice();

            let newCardList = update(newList, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, dragCard],
                ],
            });

            this.setState({
                List: newCardList,
            });
        };

        render() {
            const { designCon, currentElement } = this.props;
            return (
                <>
                    <div className="modalOverlay">
                        <div className="modalContent-navbar">
                            <h2>Form Builder</h2>
                            <CloseModal/>
                        </div>
                        <div className="modalContent">
                            <div className="modalContent-left">

                                    {this.state.currentFormElement === null ? (
                                        <>
                                        <div className="modalContent-left-fields">

                                            <div className="modalComponentTitle">
                                                <h3>Title</h3>
                                                <input
                                                    type="text"
                                                    placeholder="Set Title"
                                                    name="title"
                                                    value={this.state.title}
                                                    onChange={this.handleChange}
                                                />
                                            </div>
                                            <div className="modalComponentDescription">
                                                <h3>Description</h3>
                                                <input
                                                    type="text"
                                                    placeholder="Set Description"
                                                    name="description"
                                                    value={this.state.description}
                                                    onChange={this.handleChange}
                                                    style={{height:"150px"}}
                                                />
                                            </div>
                                            <div className="wpsf-form-elements_content">
                                                <h3 style={{display:"inline-block"}}>Form Fields</h3><span> (Simply drag & drop to use)</span>
                                                <div className="wpsf-form-elements_container">

                                            {formElements.map(function (ele, i) {
                                                return (
                                                        <BuildFormElement
                                                            addToList={this.addToList}
                                                            setCurrentFormElement={
                                                                this
                                                                    .setCurrentFormElement
                                                            }
                                                            ele={ele}
                                                            key={i}
                                                        ></BuildFormElement>

                                                );
                                            }, this)}
                                                </div>
                                            </div>

                                            <div className="modalComponentButtonLabel">
                                                <h3>Button label</h3>
                                                <input
                                                    type="text"
                                                    placeholder="Set Button Label"
                                                    name="buttonLabel"
                                                    value={this.state.buttonLabel}
                                                    onChange={this.handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="modalComponentSaveButton">
                                                <button onClick={this.props.saveToList}>
                                                    save
                                                </button>
                                        </div>
                                        </>
                                    ) : (
                                        <div>
                                            <div className="modalContent-left-fields">
                                                <div>
                                                    {this.getCurrentFormElementLeftRender()}

                                                </div>
                                                </div>
                                                <div className="modalComponentSaveButton">
                                                    <button
                                                            onClick={() => {
                                                                this.setCurrentFormElement(
                                                                    null
                                                                );
                                                                document
                                                                .querySelector(".wpsf-build-container .tab-list-item")
                                                                .click();
                                                            }}
                                                        >
                                                            Go Back
                                                        </button>
                                                </div>
                                            </div>
                                        
                                    )}
                                
                            </div>
                            <div className="modalContent-right">
                                <Tabs>
                                    <div
                                        label="Form Elements"
                                    >
                                        {formElementsDropBoard.map(function (
                                            ele,
                                            i
                                        ) {
                                            return (
                                                <DropFormBoard
                                                    List={this.state.List}
                                                    editList={this.editList}
                                                    deleteFromList={
                                                        this.deleteFromList
                                                    }
                                                    moveCard={this.moveCard}
                                                    ele={ele}
                                                    key={i}
                                                ></DropFormBoard>
                                            );
                                        },
                                        this)}
                                    </div>
                                        <div label="Preview">
                                            <ModalContentRight designCon={designCon} currentElement={currentElement.componentName}>
                                                <h3>{this.state.title}</h3>
                                                <p>{this.state.description}</p>
                                                {this.state.List.map(function (ele, i) {
                                                    return this.getCurrentFormElementRightRender(
                                                        ele,
                                                        i
                                                    );
                                                }, this)}
                                                <div className="wpsf-form-submit-button">
                                                    <button style={{color: convertToRgbaCSS(designCon.buttonTextColor), background: convertToRgbaCSS(designCon.buttonColor)}} type="button">{this.state.buttonLabel}</button>
                                                </div>
                                            </ModalContentRight>
                                    </div>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </>
            );
        }
    }
);
