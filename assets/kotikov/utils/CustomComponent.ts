import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CustomComponent')
export class CustomComponent extends Component {
    protected onEnable(): void {
        this._toggleEvents('on');
    }

    protected onDisable(): void {
        this._toggleEvents('off');
    }

    protected _toggleEvents(func: 'on' | 'off') {

    }
}


