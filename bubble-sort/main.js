class BubbleSort {
    constructor(array) {
        this.array = array;
        this.container = document.getElementById('container__bubble-sort');
        this.state = {
            current: null,
            isDone: false,
            inProcess: false,
            toSwap: null
        };
        this.init();
    }

    start() {
        this.stepTime = document.getElementById('delay').value;
        if (this.state.inProcess) {
            return;
        }
        this.state.inProcess = true;
        this.sortAsync();
    }

    async sortAsync() {
        this.state.current = 0;
        do {
            this.state.isDone = true;
            for (let i = 1; i < this.array.length; i++) {
                await this.doStep(i);
            }
        } while (!this.state.isDone);
        this.state.inProcess = false;
        this.state.toSwap = null;
        this.render();
    }

    setPointer(step) {
        return new Promise(resolve => {
            this.state.current = step;
            this.state.toSwap = null;
            this.render();
            setTimeout(() => {
                resolve();
            }, this.stepTime);
        });
    }

    compare(step) {
        return new Promise(async (resolve) => {
            const prev = this.array[step - 1];
            const cur = this.array[step];
            this.state.toSwap = cur < prev;
            this.render();
            setTimeout(() => {
                resolve(this.state.toSwap);
            }, this.stepTime);
        });
    }

    swap(step) {
        return new Promise(resolve => {
            const prev = this.array[step - 1];
            const cur = this.array[step];
            this.array[step] = prev;
            this.array[step - 1] = cur;

            this.state.isDone = false;
            setTimeout(() => {
                resolve();
            }, this.stepTime);
        });
    }

    doStep(step) {
        return new Promise(async (resolve) => {
            await this.setPointer(step);
            let needToSwap = await this.compare(step);
            if (needToSwap) {
                await this.swap(step);
            }
            resolve();
        });
    }

    render() {
        this.container.innerHTML = '';
        for (let i = 0; i < this.array.length; i++) {
            const elem = document.createElement('div');
            elem.innerHTML = this.array[i];
            elem.classList.add('item');

            if (i === this.state.current) {
                elem.classList.add('current');
                if (this.state.toSwap !== null) {
                    elem.classList.add(this.state.toSwap ? 'wrong' : 'right');
                }
            }
            this.container.appendChild(elem);
        }
    }

    shuffle() {
        if (this.state.inProcess) {
            return;
        }
        this.array.sort(() => Math.random() - 0.5);
        this.render();
    }

    init() {
        this.render();
    }
}

// const arr = Array.from(new Array(10), (x, i) => i + 1);
// arr.sort((a, b) => Math.random() - 0.5);

// let bubbleSort = new BubbleSort(arr);
let bubbleSort = new BubbleSort(Array.from(new Array(10), (x, i) => i + 1).sort((a, b) => Math.random() - 0.5));
