class AppController {
    constructor() {
        this.viewContainer = document.getElementById('viewContainer');
        this.state = 'initial';
        this.views = {
            view1: 'views/view1.html',
            view2: 'views/view2.html',
            view3: 'views/view3.html',
            view4: 'views/view4.html'
        };
        this.frameTexts = ['Anh', 'Yêu', 'Em'];
        this.isReturning = false;
    }

    async loadView(viewUrl) {
        try {
            const response = await fetch(viewUrl);
            if (!response.ok) throw new Error(`Failed to load ${viewUrl}: ${response.status}`);
            return await response.text();
        } catch (error) {
            console.error('Load view error:', error);
            return '';
        }
    }

    async init() {
        const view1Content = await this.loadView(this.views.view1);
        if (!view1Content) return;

        this.viewContainer.innerHTML = view1Content;

        const giftBox = document.getElementById('giftBox');
        if (!giftBox) {
            console.error('GiftBox element not found');
            return;
        }

        giftBox.addEventListener('click', () => this.openBox());
    }

    async openBox() {
        if (this.state !== 'initial') return;

        this.state = 'opening';
        const box = document.getElementById('box');
        const giftBox = document.getElementById('giftBox');
        const numbers = document.querySelectorAll('.anniversary-number');
        if (!box || !giftBox || !numbers) {
            console.error('Box, GiftBox, or numbers element not found');
            this.state = 'initial';
            return;
        }

        box.classList.add('open');

        await new Promise(resolve => setTimeout(resolve, 1000));

        giftBox.classList.add('moved');

        // Thêm hiệu ứng biến mất dần cho số
        numbers.forEach(number => {
            number.style.transition = 'transform 1s ease-out, opacity 1s ease-out';
            number.style.transform = 'translateY(-100%)';
            number.style.opacity = '0';
        });

        await new Promise(resolve => setTimeout(resolve, 1000)); // Chờ hiệu ứng hoàn tất

        this.flyFrames();

        this.state = 'opened';
    }

    async flyFrames() {
        const giftBox = document.getElementById('giftBox');
        const giftRect = giftBox.getBoundingClientRect();
        const startX = giftRect.left + giftRect.width / 2;
        const startY = giftRect.top + giftRect.height / 2;
        console.log('Gift box position after move:', { startX, startY });

        const frames = document.querySelectorAll('#framesContainer .flying-frame');
        if (frames.length !== 3) {
            console.error(`Expected 3 flying frames, found ${frames.length}`);
            return;
        }

        frames.forEach((frame, index) => {
            const textSpan = document.createElement('span');
            textSpan.className = 'frame-text';
            textSpan.textContent = this.frameTexts[index];
            frame.appendChild(textSpan);

            frame.style.display = 'block';
            frame.style.left = `${startX}px`;
            frame.style.top = `${startY}px`;
            frame.style.transform = 'translate(-50%, -50%) scale(0.1)';
            frame.style.opacity = '0';
            frame.style.zIndex = 1001 + index;

            void frame.offsetWidth;

            setTimeout(() => {
                frame.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                frame.style.opacity = '1';
                frame.classList.add('active');
                console.log(`Frame ${index + 1} activated with text: ${this.frameTexts[index]}`);

                if (index === 0) {
                    frame.addEventListener('click', async () => {
                        console.log(`Loading view2 from frame 1`);
                        const view2Content = await this.loadView(this.views.view2);
                        if (view2Content) {
                            this.viewContainer.innerHTML = view2Content;
                            this.state = 'view2';
                            const backButton = document.querySelector('.back-button');
                            if (backButton) {
                                backButton.addEventListener('click', () => this.backToView1());
                            }
                        }
                    });
                } else if (index === 1) {
                    frame.addEventListener('click', async () => {
                        console.log(`Loading view3 from frame 2`);
                        const view3Content = await this.loadView(this.views.view3);
                        if (view3Content) {
                            this.viewContainer.innerHTML = view3Content;
                            this.state = 'view3';
                            const backButton = document.querySelector('.view3-back-button');
                            if (backButton) {
                                backButton.addEventListener('click', () => this.backToView1());
                            }
                        }
                    });
                } else if (index === 2) {
                    frame.addEventListener('click', async () => {
                        console.log(`Loading view4 from frame 3`);
                        const view4Content = await this.loadView(this.views.view4);
                        if (view4Content) {
                            this.viewContainer.innerHTML = view4Content;
                            this.state = 'view4';
                            const backButton = document.querySelector('.view4-back-button');
                            if (backButton) {
                                backButton.addEventListener('click', () => this.backToView1());
                            }
                        }
                    });
                }

                frame.style.border = '2px solid red';
                setTimeout(() => frame.style.border = '', 2000);
            }, index * 200);
        });
    }

    async backToView1() {
        console.log('Returning to view1');
        const view1Content = await this.loadView(this.views.view1);
        if (!view1Content) return;

        this.isReturning = true; // Đặt cờ khi quay lại
        this.viewContainer.innerHTML = view1Content;
        this.state = 'opened';

        // Áp dụng trạng thái mở và ẩn số ngay lập tức khi quay lại
        const box = document.getElementById('box');
        const giftBox = document.getElementById('giftBox');
        const numbers = document.querySelectorAll('.anniversary-number');
        if (box && giftBox && numbers.length > 0 && this.isReturning) {
            box.classList.add('open');
            giftBox.classList.add('moved');
            numbers.forEach(number => {
                number.classList.add('hidden-number'); // Ẩn ngay lập tức khi quay lại
            });
        }

        // Tái tạo khung hình ở vị trí cuối
        const frames = document.querySelectorAll('#framesContainer .flying-frame');
        if (frames.length !== 3) {
            console.error(`Expected 3 flying frames, found ${frames.length}`);
            return;
        }

        frames.forEach((frame, index) => {
            const textSpan = document.createElement('span');
            textSpan.className = 'frame-text';
            textSpan.textContent = this.frameTexts[index];
            frame.appendChild(textSpan);

            frame.style.display = 'block';
            frame.style.opacity = '1';
            frame.classList.add('active');
            frame.style.zIndex = 1001 + index;

            if (index === 0) {
                frame.style.left = '20%';
                frame.style.top = '50%';
                frame.style.transform = 'translate(-50%, -50%) scale(1.1) rotate(-5deg)';
            } else if (index === 1) {
                frame.style.left = '50%';
                frame.style.top = '45%';
                frame.style.transform = 'translate(-50%, -50%) scale(1.15) rotate(0deg)';
            } else if (index === 2) {
                frame.style.left = '80%';
                frame.style.top = '50%';
                frame.style.transform = 'translate(-50%, -50%) scale(1.1) rotate(5deg)';
            }

            if (index === 0) {
                frame.addEventListener('click', async () => {
                    console.log(`Loading view2 from frame 1`);
                    const view2Content = await this.loadView(this.views.view2);
                    if (view2Content) {
                        this.viewContainer.innerHTML = view2Content;
                        this.state = 'view2';
                        const backButton = document.querySelector('.back-button');
                        if (backButton) {
                            backButton.addEventListener('click', () => this.backToView1());
                        }
                    }
                });
            } else if (index === 1) {
                frame.addEventListener('click', async () => {
                    console.log(`Loading view3 from frame 2`);
                    const view3Content = await this.loadView(this.views.view3);
                    if (view3Content) {
                        this.viewContainer.innerHTML = view3Content;
                        this.state = 'view3';
                        const backButton = document.querySelector('.view3-back-button');
                        if (backButton) {
                            backButton.addEventListener('click', () => this.backToView1());
                        }
                    }
                });
            } else if (index === 2) {
                frame.addEventListener('click', async () => {
                    console.log(`Loading view4 from frame 3`);
                    const view4Content = await this.loadView(this.views.view4);
                    if (view4Content) {
                        this.viewContainer.innerHTML = view4Content;
                        this.state = 'view4';
                        const backButton = document.querySelector('.view4-back-button');
                        if (backButton) {
                            backButton.addEventListener('click', () => this.backToView1());
                        }
                    }
                });
            }
        });

        this.isReturning = false; // Đặt lại cờ sau khi hoàn tất
    }
}