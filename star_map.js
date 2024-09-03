document.addEventListener('DOMContentLoaded', function() {
    const svg = d3.select('#starMapContainer').append('svg')
        .attr('width', '100%')
        .attr('height', '100%');

    let stars = [];
    let scale = 1; // Scale factor for zoom
    let offsetX = 0; // Pan offset X
    let offsetY = 0; // Pan offset Y

    function updateDimensions() {
        const width = svg.node().clientWidth;
        const height = svg.node().clientHeight;
        svg.attr('width', width).attr('height', height);
        drawStars();
    }

    function drawStars() {
        svg.selectAll('*').remove(); // Clear previous drawings

        const width = svg.node().clientWidth;
        const height = svg.node().clientHeight;

        svg.selectAll('circle')
            .data(stars)
            .enter()
            .append('circle')
            .attr('cx', d => (d.rightAscension / 24) * width * scale + offsetX)
            .attr('cy', d => (1 - (d.declination + 90) / 180) * height * scale + offsetY)
            .attr('r', 3 * scale)
            .attr('fill', '#fff')
            .on('mouseover', function(event, d) {
                d3.select('#starInfo')
                    .style('display', 'block')
                    .style('left', `${event.pageX + 10}px`)
                    .style('top', `${event.pageY + 10}px`)
                    .html(`
                        <strong>${d.name}</strong><br>
                        RA: ${d.rightAscension}<br>
                        Dec: ${d.declination}<br>
                        Mag: ${d.magnitude}<br>
                        Spectral Type: ${d.spectralType}
                    `);
            })
            .on('mouseout', function() {
                d3.select('#starInfo').style('display', 'none');
            });
    }

    // Load and draw stars
    fetch('assets/data/star_data.json')
        .then(response => response.json())
        .then(data => {
            stars = data.stars;
            drawStars();
        });

    // Zoom functionality
    svg.call(d3.zoom()
        .scaleExtent([0.5, 10])
        .on('zoom', function(event) {
            scale = event.transform.k;
            offsetX = event.transform.x;
            offsetY = event.transform.y;
            drawStars();
        }));

    // Initial draw and resize event
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
});
