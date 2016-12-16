(function(window, cytoscape){
    var FC = function(id){
        this.id = id;
        this.cy = this.generateFc();
        return this;
    }
    
    FC.prototype.getStyle =  function(){
        var styleArr = [
            {
                selector: 'node',
                style: {
                    'shape': 'roundrectangle',
                    'width': 150,
                    'height': 40,
                    'content': 'data(id)',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'background-color': 'gray',
                    'color': '#fff',
                    'font-size': '24px'
                }
            },

            {
                selector: 'node.isProcessing',
                style: {
                    'background-color': 'orange'
                }
            },

            {
                selector: 'node.isFinished',
                style: {
                    'background-color': 'green'
                }
            },

            {
                selector: 'edge',
                style: {
                    'width': 4,
                    'target-arrow-shape': 'triangle',
                    'line-color': 'gray',
                    'target-arrow-color': 'gray',
                    'curve-style': 'bezier',
                    // 'control-point-distances': '-30% 30%',
                    // 'control-point-weights': '0 1'
                }
            },

            {
                selector: 'edge.toRight',
                style: {
                    'curve-style': 'unbundled-bezier',
                    'control-point-distances': '30% -30%',
                    'control-point-weights': '0 1'
                }
            },

            {
                selector: 'edge.toLeft',
                style: {
                    'curve-style': 'unbundled-bezier',
                    'control-point-distances': '-30% 30%',
                    'control-point-weights': '0 1'
                }
            },

            {
                selector: 'edge.isProcessing',
                style: {
                    'line-color': 'orange',
                    'target-arrow-color': 'orange'
                }
            },

            {
                selector: 'edge.isFinished',
                style: {
                    'line-color': 'green',
                    'target-arrow-color': 'green'
                }
            }
        ];
        return styleArr;
    };
    FC.prototype.getModel = function(){
        var modelData = {
            nodes: [
                { data: { id: 'n0'}, classes: 'isFinished'},
                { data: { id: 'n1'}, classes: 'isFinished'},
                { data: { id: 'n2'}, classes: 'isFinished'},
                { data: { id: 'n3' }, classes: 'isProcessing' },
                { data: { id: 'n4' } },
                { data: { id: 'n5' } },
                { data: { id: 'n6' } },
                { data: { id: 'n7' } },
                { data: { id: 'n8' } },
                { data: { id: 'n9' } },
                { data: { id: 'n10' } },
                { data: { id: 'n11' }, classes: 'isProcessing' },
                { data: { id: 'n12' } },
                { data: { id: 'n13' } },
                { data: { id: 'n14' } },
                { data: { id: 'n15' } },
                { data: { id: 'n16' } , classes: 'isFinished'}
            ],
            edges: [
                { data: { source: 'n0', target: 'n1'}, classes: 'isFinished' },
                { data: { source: 'n1', target: 'n2'}, classes: 'isFinished' },
                { data: { source: 'n1', target: 'n16' }, classes: 'isFinished' },
                { data: { source: 'n1', target: 'n3' }, classes: 'isProcessing' },
                { data: { source: 'n3', target: 'n4' } },
                { data: { source: 'n4', target: 'n5' } },
                { data: { source: 'n4', target: 'n6' } },
                { data: { source: 'n6', target: 'n7' } },
                { data: { source: 'n6', target: 'n8' } },
                { data: { source: 'n8', target: 'n9' } },
                { data: { source: 'n8', target: 'n10' } },
                { data: { source: 'n2', target: 'n11' }, classes: 'isProcessing' },
                { data: { source: 'n11', target: 'n12' } },
                { data: { source: 'n12', target: 'n13' } },
                { data: { source: 'n13', target: 'n14' } },
                { data: { source: 'n13', target: 'n15' } },
            ]
        };
        return modelData;
    };
    FC.prototype.generateFc = function(){
        var self = this;
        var styleArr = self.getStyle();
        var modelData = self.getModel();

        var cy = cytoscape({
            container: document.getElementById(self.id),

            boxSelectionEnabled: false,
            autounselectify: true,

            layout: {
                name: 'dagre'
            },

            style: styleArr,

            elements: modelData
        });

        cy.nodes().on('click', function(e){
            alert(this._private.data.id)
        })
        cy.edges().on('click', function(e){
            alert('Edge_' + this._private.data.target)
        })
        cy.style(styleArr);

        return cy;
    }
    FC.prototype.drawProcessing = function(){
        var self = this;
        var cy = this.cy,
            canvas = $(cy._private.container).find('canvas')[2],
            ctx = canvas.getContext("2d");
        var offset = 0;
        
        function drawfn(){
            offset+=5;
            if (offset > 50) {
                offset = 0;
            }
            ctx.clearRect(0,0, canvas.width, canvas.height);

            var pro_edges = cy.$('edge.isProcessing');

            pro_edges.forEach(function(v, i){
                var ePath = v.animatePath.path;
                var eType = v.animatePath.type;

                ctx.moveTo(ePath[0], ePath[1]);
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#fff';
                ctx.fillStyle = '#fff';
                ctx.setLineDash([10,5]);
                ctx.lineDashOffset = -offset;

                switch( eType ){
                    case 'bezier':
                    case 'self':
                    case 'compound':
                    case 'multibezier':
                        for( var pi = 2; pi + 3 < ePath.length; pi += 4 ){
                            ctx.quadraticCurveTo( ePath[ pi ], ePath[ pi + 1], ePath[ pi + 2], ePath[ pi + 3] );
                        }
                        break;

                    case 'straight':
                    case 'segments':
                    case 'haystack':
                        for( var pi = 2; pi + 1 < ePath.length; pi += 2 ){
                            ctx.lineTo( ePath[ pi ], ePath[ pi + 1] );
                        }
                        break;
                }
                ctx.stroke();
            })

            setTimeout(drawfn, 150);
        }

        drawfn();
    
    }    

    window.FC = FC;
})(window, cytoscape)




		