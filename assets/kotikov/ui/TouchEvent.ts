import { _decorator, Component, EventHandler, EventTouch, Node } from 'cc';
import { CustomComponent } from '../utils/CustomComponent';
const { ccclass, property } = _decorator;

@ccclass('TouchEvent')
export class TouchEvent extends CustomComponent {
    @property([EventHandler])
    public startEvents: EventHandler[] = [];

    @property([EventHandler])
    public moveEvents: EventHandler[] = [];

    @property([EventHandler])
    public endEvents: EventHandler[] = [];

    protected _toggleEvents(func: 'on' | 'off'): void {
        this.node[func](Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node[func](Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node[func](Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node[func](Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    protected onTouchStart(event: EventTouch) {
        EventHandler.emitEvents(this.startEvents, event);
    }

    protected onTouchMove(event: EventTouch) {
        EventHandler.emitEvents(this.moveEvents, event);
    }

    protected onTouchEnd(event: EventTouch) {
        EventHandler.emitEvents(this.endEvents, event);
    }
}


