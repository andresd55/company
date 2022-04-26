import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';

@Directive({
    selector: '[appImage]'
})
export class ImageDirective implements AfterViewInit {

    @Input() src;

    constructor(private imageRef: ElementRef) {
    }

    ngAfterViewInit(): void {
        const img = new Image();
        img.onload = () => {
            this.setImage(this.src);
        };

        img.onerror = () => {
            // Set a placeholder image 
            this.setImage('../../../../assets/images/imgDefault.png');
        };
        img.src = this.src;
    }

    private setImage(src: string) {
        this.imageRef.nativeElement.setAttribute('src', src);
    }
}