import { _decorator, Component, Node, ResolutionPolicy, screen, view } from 'cc';
import { CustomComponent } from '../utils/CustomComponent';
const { ccclass, property } = _decorator;

@ccclass('AdaptUI')
export class AdaptUI extends CustomComponent {
    protected onLoad(): void {
        this.onResize();
    }

    protected _toggleEvents(func: 'on' | 'off'): void {
        screen[func]('window-resize', this.onResize, this);
    }

    protected onResize() {
        const { width, height } = screen.windowSize;
        if (width >= height) {
            view.setResolutionPolicy(ResolutionPolicy.FIXED_HEIGHT);
        } else {
            view.setResolutionPolicy(ResolutionPolicy.FIXED_WIDTH);
        }
    }
}


