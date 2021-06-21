import axios, { AxiosError, AxiosResponse } from "axios";
import BodyComponent from "../ui/BodyComponent";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

const LeftComponent = (props: any) => {
    const { title } = props;
    return (
        <div>
            {title}
            <hr />
            <div>Add new Page</div>
            <div>Add new Chapter</div>
        </div>
    );
};
const EditBook = () => {
    const history: {
        location: {
            state: {
                bookId: string;
                authorId: string;
                title: string;
                description: string;
            };
        };
    } = useHistory();

    const { location } = history;
    const { state } = location;
    const { title, description, bookId } = state;
    const [allPages, setAllPages] = useState([]);
    useEffect(() => {
        axios
            .get(`http://localhost:8000/book/getall/${bookId}`, {
                withCredentials: true,
            })
            .then((res: AxiosResponse<{ status: number }>) => {
                if (
                    res.status &&
                    typeof res.status === "number" &&
                    res.status === 200
                ) {
                    console.log(res);
                }
            })
            .catch((err: AxiosError<any>) => {
                console.log("deleteerror", err.response);
            });
    });
    return (
        <BodyComponent leftComponent={<LeftComponent title={title} />}>
            <div>{title}</div>
            <div>{description}</div>
        </BodyComponent>
    );
};

export default EditBook;
