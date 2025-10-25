document.addEventListener('DOMContentLoaded', () => {
    // Chỉ chạy hiệu ứng trên màn hình lớn hơn 768px
    if (window.innerWidth <= 768) {
        document.body.style.cursor = 'auto'; // Khôi phục con trỏ mặc định
        return;
    }

    // Ẩn con trỏ mặc định
    document.body.style.cursor = 'none';

    // Tạo phần tử chấm xanh (dot)
    const cursorDot = document.createElement('div');
    cursorDot.style.position = 'fixed';
    cursorDot.style.width = '8px';
    cursorDot.style.height = '8px';
    cursorDot.style.borderRadius = '50%';
    cursorDot.style.backgroundColor = '#0d6efd'; // Màu xanh accent
    cursorDot.style.left = '-100px'; // Bắt đầu ẩn
    cursorDot.style.top = '-100px';
    cursorDot.style.pointerEvents = 'none';
    cursorDot.style.zIndex = '9999'; // Nằm trên cùng
    cursorDot.style.opacity = '1'; 
    cursorDot.style.transform = 'translate(-50%, -50%)'; 
    document.body.appendChild(cursorDot);

    // Tạo phần tử vòng tròn xanh (outline)
    const cursorOutline = document.createElement('div');
    cursorOutline.style.position = 'fixed';
    cursorOutline.style.width = '30px';
    cursorOutline.style.height = '30px';
    cursorOutline.style.borderRadius = '50%';
    cursorOutline.style.border = '2px solid rgba(13, 110, 253, 0.5)'; // Màu xanh mờ hơn
    cursorOutline.style.left = '-100px'; // Bắt đầu ẩn
    cursorOutline.style.top = '-100px';
    cursorOutline.style.pointerEvents = 'none';
    cursorOutline.style.zIndex = '9999'; // Nằm trên cùng với dot
    cursorOutline.style.opacity = '1'; 
    cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)'; 
    cursorOutline.style.transition = 'width 0.2s ease-out, height 0.2s ease-out, border-color 0.2s ease-out, background-color 0.2s ease-out'; 
    document.body.appendChild(cursorOutline);

    // === THÊM HIỆU ỨNG VỆT SÁNG ===
    const trailCount = 10; // Số lượng chấm trong vệt
    const trails = [];
    const colors = ['#0d6efd', '#0dcaf0', '#6f42c1']; // Các màu cho vệt

    for (let i = 0; i < trailCount; i++) {
        const trail = document.createElement('div');
        trail.style.position = 'fixed';
        const size = Math.max(2, 8 - i * 0.5); // Kích thước giảm dần
        trail.style.width = `${size}px`;
        trail.style.height = `${size}px`;
        trail.style.borderRadius = '50%';
        trail.style.backgroundColor = colors[i % colors.length];
        trail.style.left = '-100px'; 
        trail.style.top = '-100px';
        trail.style.pointerEvents = 'none';
        trail.style.zIndex = '9998'; // Nằm dưới dot và outline một chút
        trail.style.opacity = `${0.8 - i * 0.08}`; // Độ mờ giảm dần
        trail.style.transform = 'translate(-50%, -50%)';
        // Không cần transition cho các trail phụ, sẽ cập nhật trực tiếp
        document.body.appendChild(trail);
        trails.push({ element: trail, x: -100, y: -100 }); 
    }
    // === KẾT THÚC THÊM VỆT SÁNG ===


    let mouseX = -100, mouseY = -100;
    let dotX = -100, dotY = -100; // Vị trí logic cho dot/outline
    let outlineX = -100, outlineY = -100;

    // Cập nhật vị trí chuột
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Hàm animation - cập nhật vị trí
    function animateCursor() {
        // Dot và Outline đi theo chuột ngay lập tức (hoặc có thể thêm easing nhẹ nếu muốn)
        dotX = mouseX;
        dotY = mouseY;
        outlineX = mouseX;
        outlineY = mouseY; 
        
        cursorDot.style.left = `${dotX}px`;
        cursorDot.style.top = `${dotY}px`;
        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;

        // Cập nhật các chấm trong vệt sáng
        trails.forEach((trail, index) => {
            const { element } = trail;
            
            // Chấm đầu tiên của vệt sẽ theo dot/outline
            const targetX = (index === 0) ? dotX : trails[index - 1].x;
            const targetY = (index === 0) ? dotY : trails[index - 1].y;

            // Áp dụng easing nhẹ cho vệt sáng
            trail.x += (targetX - trail.x) * 0.5; 
            trail.y += (targetY - trail.y) * 0.5; 

            element.style.left = `${trail.x}px`;
            element.style.top = `${trail.y}px`;
        });
        
        requestAnimationFrame(animateCursor);
    }

    // Bắt đầu animation
    animateCursor();

     // Hiệu ứng phóng to Outline khi hover link/button
     const interactiveElements = document.querySelectorAll('a, button, .cta-button, .post-card, .featured-post-card, .logo, .mobile-menu');
     
     interactiveElements.forEach(el => {
        el.style.cursor = 'pointer'; 
        
        el.addEventListener('mouseenter', () => {
             cursorOutline.style.width = '40px';
             cursorOutline.style.height = '40px';
             cursorOutline.style.borderColor = '#0dcaf0'; 
             cursorOutline.style.backgroundColor = 'rgba(13, 110, 253, 0.1)'; 
        });
        el.addEventListener('mouseleave', () => {
             cursorOutline.style.width = '30px';
             cursorOutline.style.height = '30px';
             cursorOutline.style.borderColor = 'rgba(13, 110, 253, 0.5)'; 
             cursorOutline.style.backgroundColor = 'transparent'; 
        });
    });

    // Ẩn hiệu ứng khi chuột rời khỏi cửa sổ
    document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = '0';
        cursorOutline.style.opacity = '0';
        trails.forEach(t => t.element.style.opacity = '0'); // Ẩn cả vệt sáng
    });
    document.addEventListener('mouseenter', () => {
        cursorDot.style.opacity = '1';
        cursorOutline.style.opacity = '1';
        trails.forEach((t, i) => t.element.style.opacity = `${0.8 - i * 0.08}`); // Hiện lại vệt sáng
    });

    // Xử lý khi resize về mobile
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            cursorDot.style.display = 'none'; 
            cursorOutline.style.display = 'none'; 
            trails.forEach(t => t.element.style.display = 'none'); // Ẩn cả vệt sáng
            document.body.style.cursor = 'auto'; 
        } else {
             cursorDot.style.display = 'block'; 
             cursorOutline.style.display = 'block'; 
             trails.forEach(t => t.element.style.display = 'block'); // Hiện lại vệt sáng
             document.body.style.cursor = 'none'; 
        }
    });
});

