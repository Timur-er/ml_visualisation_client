import React, {useEffect, useRef} from 'react';
import * as d3 from 'd3';

const PerceptronVisualising = ({ data, weights, bias }) => {
    const svgRef = useRef();
    const spacing = 120;
    const width = 1200;
    const height = 800;

    let change_data = data.map(item => {
        return {x: item[0], y: item[1]}
    })

    const svg = d3.select(svgRef.current)
        .append('svg')
        .attr("width", width).attr("height", height)
        .style('background', 'red')
        .append('g')
        .attr("transform", "translate(" + spacing/2 + "," + spacing/2 + ")")


    // Set up scales - assuming data is in a range of 0-1 for simplicity
    const xScale = d3.scaleLinear()
        .domain([d3.min(change_data, d => d.x) - 1, d3.max(change_data, d => d.x) + 1])
        .range([0, width - spacing]);

    const yScale = d3.scaleLinear()
        .domain([d3.min(change_data, function (d){return d.y})-1, d3.max(change_data, function (d){return d.y})+1])
        .range([height-spacing, 0]);

    useEffect(() => {
        const xAxis = d3.axisBottom(xScale)
        const yAxis = d3.axisLeft(yScale)

        svg.append("g")
            .attr("transform", "translate(0," + (height - spacing) + ")")
            .call(xAxis);

        svg.append("g")
            .call(yAxis);

        svg.selectAll("circle")
            .data(change_data)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d.x))
            .attr("cy", d => yScale(d.y))
            .attr("r", 5)
            .style("fill", "purple");

    }, [data])




    useEffect(() => {

        svg.select("path.decision-boundary").remove()
        // Draw decision boundary
        const lineData = d3.range(d3.min(change_data, d => d.x) - 1, d3.max(change_data, d => d.x) + 1, 0.1).map(x => {
            return {
                x: x,
                y: (-weights[0]/weights[1]) * x - (bias/weights[1])
            };
        });

        const lineGenerator = d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y))

        d3.selectAll(".decision-boundary").remove()

        svg.append("path")
            .datum(lineData)
            .attr("d", lineGenerator)
            .attr("fill", "black")
            .attr("stroke", "black")
            .attr("class", "decision-boundary");


    }, [weights, bias])

    return (
        <svg ref={svgRef} width={width} height={height}></svg>
    );
};

export default PerceptronVisualising;