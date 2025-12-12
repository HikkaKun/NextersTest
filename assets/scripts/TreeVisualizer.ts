import { _decorator, Color, Component, instantiate, Node, Prefab, Sprite, toDegree, UITransform, Vec3 } from 'cc';
import { INode } from './INode';
import { TreeNode } from './TreeNode';
import { TreeNodeView } from './TreeNodeView';
const { ccclass, property } = _decorator;

@ccclass('TreeVisualizer')
export class TreeVisualizer extends Component {
    @property(Prefab)
    public treeNodePrefab: Prefab | null = null;

    @property(Prefab)
    public connectionPrefab: Prefab | null = null;

    @property({ min: 0 })
    public nodeWidth = 100;

    @property({ min: 0 })
    public nodeHeight = 100;

    private _root: INode | null = null;
    private _nodeToINodeMap = new Map<Node, INode>();
    private _iNodeToNodeMap = new Map<INode, Node>();

    protected start(): void {
        const root = new TreeNode();

        for (let i = 0; i < 3; i++) {
            new TreeNode(root);
        }

        for (let i = 0; i < 3; i++) {
            new TreeNode(root.first!);
        }

        for (let i = 0; i < 2; i++) {
            new TreeNode(root.last!);
        }

        for (let i = 0; i < 2; i++) {
            new TreeNode(root.last!.last!);
        }

        this.visualize(root);
    }

    public visualize(root: INode) {
        if (!this.treeNodePrefab || !this.connectionPrefab) return;

        this.node.destroyAllChildren();
        this.node.removeAllChildren();
        this._nodeToINodeMap.clear();
        this._iNodeToNodeMap.clear();

        this._root = root;

        const arrayTree: INode[][][] = [[[root]]];

        const createCallbackByDepth = (depth: number) => {
            return (node: INode) => {
                if (!node.count) return;

                if (arrayTree[depth] === undefined) {
                    arrayTree[depth] = [];
                }

                const children: INode[] = [];
                node.each(child => children.push(child));
                arrayTree[depth].push(children);

                node.each(createCallbackByDepth(depth + 1));
            }
        }

        createCallbackByDepth(1)(root);

        const createNode = (iNode: INode) => {
            const node = instantiate(this.treeNodePrefab!);
            node.parent = this.node;

            node.getComponent(TreeNodeView)!.visualizer = this;

            this._iNodeToNodeMap.set(iNode, node);
            this._nodeToINodeMap.set(node, iNode);

            return node;
        }

        let maxWidth = 1;
        for (const groups of arrayTree) {
            const width = this._getLevelWidth(groups);
            if (width > maxWidth) maxWidth = width;
        }

        const { nodeWidth, nodeHeight } = this;
        const xOffset = (maxWidth - 1) * 0.5 * -nodeWidth;

        const totalGroups = this._getLevelWidth(arrayTree);
        const colors = this._createColors(totalGroups);
        const depth = arrayTree.length;
        for (let i = 0; i < depth; i++) {
            let currentHorizontalIndex = 0;
            const groupsCount = arrayTree[i].length;
            const currentWidth = this._getLevelWidth(arrayTree[i]);
            const diff = maxWidth - currentWidth;
            const levelOffset = diff * 0.5 * nodeWidth;
            for (let j = 0; j < groupsCount; j++) {
                const iNodes = arrayTree[i][j];
                const count = arrayTree[i][j].length;
                const color = colors.shift()!;
                for (let k = 0; k < count; k++) {
                    const node = createNode(iNodes[k]);
                    node.setPosition(currentHorizontalIndex * nodeWidth + xOffset + levelOffset, i * -nodeHeight, 0);
                    node.getComponent(Sprite)!.color = color;
                    currentHorizontalIndex++;
                }
            }
        }

        const createConnectionsCallback = (iNode: INode) => {
            const parentNode = this._iNodeToNodeMap.get(iNode)!;
            iNode.each(child => {
                const childNode = this._iNodeToNodeMap.get(child)!;
                this._createConnection(parentNode, childNode);

            });

            iNode.each(createConnectionsCallback);
        }

        createConnectionsCallback(root);
    }

    public removeNode(node: Node) {
        if (!this._root) return;
        const iNode = this._nodeToINodeMap.get(node);
        if (!iNode || iNode === this._root) return;

        iNode.parent!.remove(iNode);
        this.visualize(this._root);
    }

    public addNode(node: Node) {
        if (!this._root) return;
        const iNode = this._nodeToINodeMap.get(node);
        if (!iNode) return;

        new TreeNode(iNode);
        this.visualize(this._root);
    }

    private _getLevelWidth(groups: any[][]): number {
        return groups.reduce((sum, group) => sum + group.length, 0);
    }

    private _createConnection(a: Node, b: Node) {
        const connectionNode = instantiate(this.connectionPrefab!);
        connectionNode.parent = this.node;
        connectionNode.setSiblingIndex(0);
        connectionNode.setPosition(a.position);

        const diff = Vec3.subtract(tempVec3, b.position, a.position);
        connectionNode.angle = toDegree(Math.atan2(diff.y, diff.x));
        connectionNode.getComponent(UITransform)!.width = diff.length();
    }

    private _createColors(count: number): Color[] {
        let result: Color[] = [];
        for (let i = 0; i < count; i++) {
            result.push(new Color().fromHSV(i / count, 1, 1));
        }

        return result;
    }
}

const tempVec3 = new Vec3();