import { _decorator, Component, Node, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

export enum ControlsMode {
    ADD,
    REMOVE,
}

@ccclass('Controls')
export class Controls extends Component {
    public static instance: Controls;

    @property(UIOpacity)
    public addSpriteOpacity: UIOpacity = null!;

    @property(UIOpacity)
    public removeSpriteOpacity: UIOpacity = null!;

    public get mode() {
        return this._mode;
    }

    private _mode = ControlsMode.ADD;

    protected onLoad(): void {
        Controls.instance = this;
        this.onAddClicked();
    }

    private _toggleSprite(opacity: UIOpacity, isOn: boolean) {
        opacity.opacity = isOn ? 255 : 128;
    }

    protected onAddClicked() {
        this._mode = ControlsMode.ADD;
        this._toggleSprite(this.addSpriteOpacity, true);
        this._toggleSprite(this.removeSpriteOpacity, false);
    }

    protected onRemoveClicked() {
        this._mode = ControlsMode.REMOVE;
        this._toggleSprite(this.addSpriteOpacity, false);
        this._toggleSprite(this.removeSpriteOpacity, true);
    }
}

