export class SvgAdapter {

    private static readonly TILE_SIZE = 11;
    private static readonly TILE_PADDING = 1;
    private static readonly GRID_FACTOR = this.TILE_SIZE + this.TILE_PADDING;
    private static readonly PADDING = 0.5;
    private static readonly TEXT_COLOR: string[] = ['#9a60b4', '#8600b3', '#2d00b3', '#002db3', '#0086b3', '#00b386', '#00b32d', '#2db300', '#86b300', '#b38600', '#b32d00', '#fff', '#fff', '#fff', '#fff', '#fff'];
    private static readonly FILL_COLOR: string[] = ['#e6acd7', '#d7ace6', '#baace6', '#acbae6', '#acd7e6', '#ace6d7', '#ace6ba', '#bae6ac', '#d7e6ac', '#e6d7ac', '#e6baac', '#9a60b4', '#d7ace6', '#baace6', '#acbae6', '#acd7e6'];
    private static readonly BORDER_COLOR: string[] = ['#9a60b4', '#8600b3', '#2d00b3', '#002db3', '#0086b3', '#00b386', '#00b32d', '#2db300', '#86b300', '#b38600', '#b32d00', '#9a60b4', '#d7ace6', '#baace6', '#acbae6', '#acd7e6'];

    private readonly numberRects: Array<SVGRectElement>;
    private readonly numberTexts: Array<SVGTextElement>;
    private readonly fieldsGroup: SVGGElement;
    private readonly numbersGroup: SVGGElement;

    constructor(private readonly element: SVGSVGElement) {
        this.fieldsGroup = this.group();
        this.numbersGroup = this.group();
        this.numberRects = [];
        this.numberTexts = [];
    }

    init(size: number) {
        this.element.setAttribute('width', `${SvgAdapter.PADDING * 2 + size * SvgAdapter.GRID_FACTOR - SvgAdapter.TILE_PADDING}vh`);
        this.element.setAttribute('height', `${SvgAdapter.PADDING * 2 + size * SvgAdapter.GRID_FACTOR - SvgAdapter.TILE_PADDING}vh`);
        for (let y = 0; y < size; ++y) {
            for (let x = 0; x < size; ++x) {
                this.createField(x, y);
                this.numberRects.push(this.createNumberRect(x, y));
                this.numberTexts.push(this.text(x, y));
            }
        }
    }

    clear(index: number) {
        const rt = this.numberRects[index];
        rt.setAttribute('opacity', '0');
        const t = this.numberTexts[index];
        t.setAttribute('opacity', '0');
    }

    number(index: number, numberIndex: number) {
        const rt = this.numberRects[index];
        rt.setAttribute('opacity', '1');
        rt.setAttribute('fill', SvgAdapter.FILL_COLOR[numberIndex]);
        rt.setAttribute('stroke', SvgAdapter.BORDER_COLOR[numberIndex]);
        const t = this.numberTexts[index];
        t.setAttribute('fill', SvgAdapter.TEXT_COLOR[numberIndex]);
        t.setAttribute('opacity', '1');
        const txt = `${1 << numberIndex}`;
        t.innerHTML = txt;
        if (txt.length < 5) {
            t.setAttribute('font-size', '5vh');
        } else {
            t.setAttribute('font-size', '4vh');
        }
    }

    private createField(x: number, y: number) {
        const rt = this.element.ownerDocument.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rt.x.baseVal.valueAsString = `${SvgAdapter.PADDING + x * SvgAdapter.GRID_FACTOR}vh`;
        rt.y.baseVal.valueAsString = `${SvgAdapter.PADDING + y * SvgAdapter.GRID_FACTOR}vh`;
        rt.width.baseVal.valueAsString = `${SvgAdapter.TILE_SIZE}vh`;
        rt.height.baseVal.valueAsString = `${SvgAdapter.TILE_SIZE}vh`;
        rt.rx.baseVal.valueAsString = `${SvgAdapter.TILE_PADDING}vh`;
        rt.ry.baseVal.valueAsString = `${SvgAdapter.TILE_PADDING}vh`;
        rt.setAttribute('fill', '#c0c0c0');
        this.fieldsGroup.appendChild(rt);
    }

    private createNumberRect(x: number, y: number): SVGRectElement {
        const rt = this.element.ownerDocument.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rt.x.baseVal.valueAsString = `${SvgAdapter.PADDING + x * SvgAdapter.GRID_FACTOR}vh`;
        rt.y.baseVal.valueAsString = `${SvgAdapter.PADDING + y * SvgAdapter.GRID_FACTOR}vh`;
        rt.width.baseVal.valueAsString = `${SvgAdapter.TILE_SIZE}vh`;
        rt.height.baseVal.valueAsString = `${SvgAdapter.TILE_SIZE}vh`;
        rt.rx.baseVal.valueAsString = `${SvgAdapter.TILE_PADDING}vh`;
        rt.ry.baseVal.valueAsString = `${SvgAdapter.TILE_PADDING}vh`;
        rt.setAttribute('stroke-width', '2px');
        rt.setAttribute('opacity', '0');
        this.numbersGroup.appendChild(rt);
        return rt;
    }

    private text(x: number, y: number): SVGTextElement {
        const t = this.element.ownerDocument.createElementNS('http://www.w3.org/2000/svg', 'text');
        t.setAttribute('x', `${SvgAdapter.PADDING + x * SvgAdapter.GRID_FACTOR + SvgAdapter.TILE_SIZE * .5}vh`);
        t.setAttribute('y', `${SvgAdapter.PADDING + y * SvgAdapter.GRID_FACTOR + SvgAdapter.TILE_SIZE * .5}vh`);
        t.setAttribute('opacity', '0');
        t.setAttribute('text-anchor', 'middle')
        t.setAttribute('alignment-baseline', 'central')
        this.numbersGroup.appendChild(t);
        return t;
    }

    private group(): SVGGElement {
        const g = this.element.ownerDocument.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.element.appendChild(g);
        return g;
    }

}