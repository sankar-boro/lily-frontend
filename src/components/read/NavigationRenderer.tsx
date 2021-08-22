import { activeChBg, activeScBg } from "./util";
import { useBookContext} from "../../service/BookServiceProvider";


const ReadBookNavigation = (props: any) => {
    const context = useBookContext();
    const { data, activeId, sectionId } = context;
    const doSome = (data: any) => {
        let child = [];
        if (data && data.child && Array.isArray(data.child)) {
            child = data.child;
        }

        return {
            chapter: data,
            sections: child,
        };
    };
    return (
        <div className="con-20 scroll-view" style={{ backgroundColor: "#ceffc9", padding: "0px 10px" }}>
            <div style={{height: 35}}/>
            {data.map((value: any, index: number) => {
                const { chapter, sections } = doSome(value);
                return (
                    <div key={chapter.title}>
                        <div
                            onClick={(e) => {
                                e.preventDefault();
                                context.dispatch({
                                    type: 'ID_SETTER',
                                    payload: chapter.uniqueId,
                                    idType: 'ACTIVE_ID',
                                });
                                context.dispatch({
                                    type: 'ID_SETTER',
                                    payload: null,
                                    idType: 'SECTION_ID',
                                });
                            }}
                            className={`chapter-nav hover ${activeChBg(
                                chapter,
                                activeId
                            )}`}
                        >
                            {chapter.title}
                        </div>
                        <div>
                            {sections.map((c: any) => {
                                return (
                                    <div
                                        onClick={(e) => {
                                            e.preventDefault();
                                            context.dispatch({
                                                type: 'ID_SETTER',
                                                payload: chapter.uniqueId,
                                                idType: 'ACTIVE_ID',
                                            });
                                            context.dispatch({
                                                type: 'ID_SETTER',
                                                payload: c.uniqueId,
                                                idType: 'SECTION_ID',
                                            });
                                        }}
                                        key={c.uniqueId}
                                        className="section-nav hover"
                                    >
                                        {c.title}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ReadBookNavigation;
