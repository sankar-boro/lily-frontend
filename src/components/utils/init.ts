import { Node as NodeData } from "../../globals/types";

export default class Node {
    node: NodeData;

    constructor(node: NodeData) {
        this.node = node;
    }

    getUniqueId() {
        return this.node.uniqueId;
    }
}
