import { useHistory } from "react-router";

const BodyComponent = (props: any) => {
    const history = useHistory();
    const { bookId, allPages, header } = props;
    return (
        <>
            <div className="navbar-left">{props.leftComponent}</div>
            <div className="body-container">
                <div className="toolbar">
                    <div className="document-categories"></div>
                    <div className="read-header">{header}</div>
                    <div className="settings">
                        <div
                            className="div-inline hover"
                            onClick={(e) => {
                                e.preventDefault();
                                history.replace({
                                    pathname: `/book/edit/${bookId}`,
                                    state: {
                                        main: history.location.state,
                                        allPages,
                                    },
                                });
                            }}
                        >
                            Edit
                        </div>
                    </div>
                </div>
                <div>{props.children}</div>
            </div>
        </>
    );
};

export default BodyComponent;
