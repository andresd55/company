import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Viewer } from './viewer.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Component } from '@angular/core';
import { ButtonModule } from '../../primeng/button/button';
import { Footer } from '../../primeng/api/public_api';
import { FocusTrapModule } from '../../primeng/focustrap/public_api';

@Component({
    template: `
    <p-viewer [(visible)]="display">
    <p-footer>
            <button type="button" pButton icon="pi pi-check" (click)="display=false" label="Yes"></button>
            <button type="button" pButton icon="pi pi-times" (click)="display=false" label="No" class="ui-button-secondary"></button>
    </p-footer>
    </p-viewer>
    <button type="button" (click)="showViewer()" pButton icon="fas fa-info-circle" label="Show"></button>
    `
})
class TestViewerComponent {
    display: boolean = false;

    showDialog() {
        this.display = true;
    }
}

describe('Viewer', () => {

    let viewer: Viewer;
    let fixture: ComponentFixture<TestViewerComponent>;
    let testComponent: TestViewerComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                FocusTrapModule,
                ButtonModule
            ],
            declarations: [
                Viewer,
                Footer,
                TestViewerComponent
            ]
        });

        fixture = TestBed.createComponent(TestViewerComponent);
        viewer = fixture.debugElement.children[0].componentInstance;
        testComponent = fixture.debugElement.componentInstance;
    });

    it('should display the header', () => {
        viewer.header = 'PrimeNG Viewer Header';
        fixture.detectChanges();

        const buttonEl = fixture.debugElement.query(By.css('button'));
        buttonEl.nativeElement.click();
        fixture.detectChanges();

        const headerEl = fixture.debugElement.query(By.css('.p-viewer-title'));
        expect(headerEl.nativeElement.textContent).toContain('PrimeNG Viewer Header')
    });

    it('should display the close icon when closable', () => {
        const buttonEl = fixture.debugElement.query(By.css('button'));
        buttonEl.nativeElement.click();
        fixture.detectChanges();

        const closeEl = fixture.debugElement.query(By.css('.p-viewer-header-close'));
        expect(closeEl).not.toBeNull();
    });

    it('should display the resizer when resizable is true', () => {
        const buttonEl = fixture.debugElement.query(By.css('button'));
        buttonEl.nativeElement.click();
        fixture.detectChanges();

        const resizeEl = fixture.debugElement.query(By.css('.p-resizable-handle'));
        expect(resizeEl).not.toBeNull();
    });

    it('should not create the container element by default', () => {
        fixture.detectChanges();

        expect(fixture.debugElement.children[0].nativeElement.childElementCount).toEqual(0);
        expect(viewer.visible).toEqual(false);
    });

    it('should add rtl class when rtl is enabled', () => {
        viewer.rtl = true;
        const buttonEl = fixture.debugElement.query(By.css('button'));
        buttonEl.nativeElement.click();
        fixture.detectChanges();

        const rtlEl = fixture.debugElement.query(By.css('.p-viewer-rtl'));
        expect(rtlEl).toBeTruthy();
    });

    it('should add draggable class when dragging is enabled', () => {
        const buttonEl = fixture.debugElement.query(By.css('button'));
        buttonEl.nativeElement.click();
        fixture.detectChanges();

        const draggableEl = fixture.debugElement.query(By.css('.p-viewer-draggable'));
        expect(draggableEl).toBeTruthy();
    });

    it('should update visible as false binding when close icon is clicked', () => {
        let show = true;
        const buttonEl = fixture.debugElement.query(By.css('button'));
        buttonEl.nativeElement.click();
        fixture.detectChanges();
        viewer.visibleChange.subscribe(value => show = value);

        const closeEl = fixture.nativeElement.querySelector('.p-viewer-header-close');
        closeEl.click();

        expect(show).toEqual(false);
    });

    it('should maximizable', fakeAsync(() => {
        viewer.maximizable = true;
        fixture.detectChanges();

        const buttonEl = fixture.debugElement.query(By.css('button'));
        buttonEl.nativeElement.click();
        fixture.detectChanges();

        tick(300);
        const maximizeSpy = spyOn(viewer, 'maximize').and.callThrough();
        const maximizableEl = fixture.nativeElement.querySelector('.p-viewer-header-maximize');
        expect(maximizableEl).toBeTruthy();
        maximizableEl.click();
        fixture.detectChanges();

        const minIconEl = fixture.debugElement.query(By.css('.pi-window-minimize'));
        expect(maximizeSpy).toHaveBeenCalled();
        expect(viewer.maximized).toEqual(true);
        expect(minIconEl).toBeTruthy();
        viewer.container = fixture.debugElement.query(By.css('div')).nativeElement;
        fixture.detectChanges();

        maximizableEl.click();
        tick(350);
        fixture.detectChanges();

        expect(viewer.maximized).toEqual(false);
    }));

    it('should close (maximized)', fakeAsync(() => {
        viewer.maximizable = true;
        fixture.detectChanges();

        const buttonEl = fixture.debugElement.query(By.css('button'));
        buttonEl.nativeElement.click();
        fixture.detectChanges();

        viewer.container = fixture.debugElement.query(By.css('div')).nativeElement;
        fixture.detectChanges();

        const maximizableEl = fixture.nativeElement.querySelector('.p-viewer-header-maximize ');
        expect(maximizableEl).toBeTruthy();
        maximizableEl.click();
        fixture.detectChanges();

        const closeEl = fixture.debugElement.query(By.css('.p-viewer-header-close'));
        viewer.visibleChange.subscribe(value => viewer.visible = value);
        closeEl.nativeElement.click();
        tick(350);
        fixture.detectChanges();

        expect(viewer.visible).toEqual(false);
    }));

    it('should change modal blockScroll and dismissableMask ', fakeAsync(() => {
        const closeSpy = spyOn(viewer, 'close').and.callThrough();
        viewer.modal = true;
        viewer.blockScroll = true;
        viewer.dismissableMask = true;
        fixture.detectChanges();

        const buttonEl = fixture.debugElement.query(By.css('button'));
        buttonEl.nativeElement.click();
        fixture.detectChanges();

        const viewerEl = fixture.debugElement.query(By.css('div'));
        const closeEl = fixture.debugElement.query(By.css('.p-viewer-header-close'));
        expect(viewerEl).toBeTruthy();
        viewer.visibleChange.subscribe(value => viewer.visible = value);
        closeEl.nativeElement.click();
        closeEl.nativeElement.dispatchEvent(new Event('mousedown'));
        tick(350);
        fixture.detectChanges();

        expect(viewer.visible).toEqual(false);
        expect(closeSpy).toHaveBeenCalled();
    }));

    it('should open with focusOnShow', () => {
        viewer.focusOnShow = true;
        fixture.detectChanges();

        const buttonEl = fixture.debugElement.query(By.css('button'));
        buttonEl.nativeElement.click();
        fixture.detectChanges();

        expect(viewer.visible).toEqual(true);
    });

    it('should change appendTo (body)', () => {
        viewer.appendTo = "body";
        fixture.detectChanges();

        const buttonEl = fixture.debugElement.query(By.css('button'));
        buttonEl.nativeElement.click();
        fixture.detectChanges();

        expect(viewer.visible).toEqual(true);
    });

    it('should change appendTo (button)', () => {
        viewer.appendTo = fixture.debugElement.query(By.css('button')).nativeElement;
        fixture.detectChanges();

        const buttonEl = fixture.debugElement.query(By.css('button'));
        buttonEl.nativeElement.click();
        fixture.detectChanges();

        expect(viewer.visible).toEqual(true);
    });

    it('should call ngOnDestroy', fakeAsync(() => {
        viewer.maximizable = true;
        viewer.modal = true;
        viewer.appendTo = "body";
        fixture.detectChanges();

        const restoreAppendSpy = spyOn(viewer, 'restoreAppend').and.callThrough();
        const onOverlayHideSpy = spyOn(viewer, 'onContainerDestroy').and.callThrough();
        const disableModalitySpy = spyOn(viewer, 'disableModality').and.callThrough();
        const buttonEl = fixture.debugElement.query(By.css('button'));
        buttonEl.nativeElement.click();
        fixture.detectChanges();

        viewer.container = fixture.debugElement.query(By.css('div')).nativeElement;
        fixture.detectChanges();

        const maximizableEl = fixture.nativeElement.querySelector('.p-viewer-header-maximize ');
        maximizableEl.click();
        fixture.detectChanges();

        viewer.container = fixture.debugElement.query(By.css('div')).nativeElement;
        fixture.detectChanges();

        maximizableEl.click();
        tick(350);
        fixture.detectChanges();

        viewer.ngOnDestroy();
        fixture.detectChanges();

        expect(restoreAppendSpy).toHaveBeenCalled();
        expect(onOverlayHideSpy).toHaveBeenCalled();
        expect(disableModalitySpy).toHaveBeenCalled();
        expect(viewer.container).toEqual(null);
    }));

    it('should change location with drag actions', fakeAsync(() => {
        fixture.detectChanges();

        const buttonEl = fixture.debugElement.query(By.css('button'));
        buttonEl.nativeElement.click();
        fixture.detectChanges();

        tick(300);
        let firstLeft = viewer.container.style.left;
        let firstTop = viewer.container.style.top;
        let event = {
            'pageX': 500,
            'pageY': 500,
            'target': fixture.debugElement.nativeElement.querySelector('.p-viewer-header')
        };
        viewer.initDrag(event as MouseEvent);
        expect(viewer.dragging).toEqual(true);
        event.pageX = 505;
        event.pageY = 505;
        viewer.onDrag(event as MouseEvent);
        viewer.endDrag(event as MouseEvent);
        fixture.detectChanges();

        expect(viewer.container.style.left).not.toEqual(firstLeft);
        expect(viewer.container.style.top).not.toEqual(firstTop);
        expect(viewer.dragging).toEqual(false);
    }));

    it('should change location with resize actions', fakeAsync(() => {
        fixture.detectChanges();

        const buttonEl = fixture.debugElement.query(By.css('button'));
        buttonEl.nativeElement.click();
        fixture.detectChanges();

        tick(300);
        let firstWidth = viewer.container.offsetWidth;
        let firstHeight = viewer.container.offsetHeight;
        let event = {
            'pageX': 500,
            'pageY': 500
        };
        viewer.initResize(event as MouseEvent);
        expect(viewer.resizing).toEqual(true);
        event.pageX = 505;
        event.pageY = 505;
        viewer.onResize(event as MouseEvent);
        viewer.resizeEnd(event as MouseEvent);
        fixture.detectChanges();

        expect(parseInt(viewer.container.style.width)).not.toEqual(firstWidth);
        expect(parseInt(viewer.container.style.height)).not.toEqual(firstHeight);
        expect(viewer.resizing).toEqual(false);
    }));

    it('should close when press esc key', fakeAsync(() => {
        fixture.detectChanges();

        const buttonEl = fixture.debugElement.query(By.css('button'));
        buttonEl.nativeElement.click();
        const closeSpy = spyOn(viewer, "close").and.callThrough();
        fixture.detectChanges();

        tick(300);
        const escapeEvent: any = document.createEvent('CustomEvent');
        escapeEvent.which = 27;
        escapeEvent.initEvent('keydown', true, true);
        document.dispatchEvent(escapeEvent);
        document.dispatchEvent(escapeEvent as KeyboardEvent);
        fixture.detectChanges();

        expect(closeSpy).toHaveBeenCalled();
    }));
});
