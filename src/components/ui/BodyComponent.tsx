import { useHistory } from "react-router";

const BodyComponent = (props: any) => {
    const history = useHistory();
    const { bookId, allPages } = props;
    console.log("props", props);
    return (
        <>
            <div className="navbar-left">{props.leftComponent}</div>
            <div className="body-container">
                <div className="toolbar">
                    <div className="document-categories">
                        <div className="document-section">Novels</div>
                        <div className="document-section">Science</div>
                        <div className="document-section">Maths</div>
                        <div className="document-section">History</div>
                    </div>
                    <div className="settings">
                        <div
                            className="document-section"
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
