import { _decorator, Component, Node } from 'cc';
import { TreeVisualizer } from './TreeVisualizer';
import { Controls, ControlsMode } from './Controls';
const { ccclass, property } = _decorator;

@ccclass('TreeNodeView')
export class TreeNodeView extends Component {
    public visualizer: TreeVisualizer | null = null;

    protected onTouchStart() {
        if (!this.visualizer) return;

        switch (Controls.instance.mode) {
            case ControlsMode.ADD:
                this.visualizer.addNode(this.node);
                break;
            case ControlsMode.REMOVE:
                this.visualizer.removeNode(this.node);
                break;
        }
    }
}


