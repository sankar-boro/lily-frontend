const Card = (props: { history: any; data: any; setRead: Function }) => {
    const { history, data, setRead } = props;
    return (
        <div
            className="document-card"
            key={data.bookId}
            onClick={() => {
                setRead(true);
                history.push({
                    pathname: `/book/view/${data.bookId}`,
                    state: data,
                });
            }}
        >
            <div>
                <div className="document-title hover">{data.title}</div>
                <div className="document-body hover">
                    {data.body.substr(0, 250)}...
                </div>
            </div>
        </div>
    );
};

export default Card;
