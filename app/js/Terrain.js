class Terrain {

    constructor(mesh) {
        this.mesh = mesh;
        this.colors = [new THREE.Color('snow'), new THREE.Color('green'), new THREE.Color('dimgrey')];
        this.geoLOD = 4;
    }
    
    calcHeightAt(coordx, coordy, octaves) {
        function fractsin(a) {
            a = 100000.0 * Math.sin(a * .001);
            return a - Math.floor(a);
        }
        function mix(x, y, a) {
            return x * (1 - a) + y * a;
        }
        function smoothstep(edge0, edge1, x) {
            var t = (x - edge0) / (edge1 - edge0);
            t = Math.min(1, Math.max(0, t));
            return t * t * (3.0 - 2.0 * t);
        }
        function snoise(coordx, coordy) {
            var px = Math.floor(coordx), py = Math.floor(coordy);
            var fx = coordx - px, fy = coordy - py;
            var v = px + py * 1000.0;
            var rx = fractsin(v), ry = fractsin(v + 1), rz = fractsin(v + 1000), rw = fractsin(v + 1001);
            fx = fx * fx * (3.0 - 2.0 * fx);
            fy = fy * fy * (3.0 - 2.0 * fy);
            return 2.0 * (mix(mix(rx, ry, fx), mix(rz, rw, fx), fy)) - 1.0;
        }
        var h = 0.0; // height
        var w = 0.5; // octave weight
        var m = 0.4; // octave multiplier
        for (var i = 0; i < 20; i++) {
            if (i < octaves) {
                h += w * snoise(coordx * m, coordy * m);
            }
            else break;
            w *= 0.5;
            m *= 2.0;
        }
        h += smoothstep(-0.6, 1.2, h); // exaggerate the higher terrain
        return h;
    }

    buildSquareAt(x, y, size) {
        var x0 = x, y0 = y, x1 = x0 + size, y1 = y0 + size;
        var v = this.mesh.geometry.vertices.length;
        var h00 = this.calcHeightAt(x0, y0, this.geoLOD);
        var h01 = this.calcHeightAt(x0, y1, this.geoLOD);
        var h10 = this.calcHeightAt(x1, y0, this.geoLOD);
        var h11 = this.calcHeightAt(x1, y1, this.geoLOD);
        this.mesh.geometry.vertices.push(new THREE.Vector3(x0, y0, h00));
        this.mesh.geometry.vertices.push(new THREE.Vector3(x0, y1, h01));
        this.mesh.geometry.vertices.push(new THREE.Vector3(x1, y0, h10));
        this.mesh.geometry.vertices.push(new THREE.Vector3(x1, y1, h11));
        var f1 = new THREE.Face3(v, v + 2, v + 1);//, undefined, h00 < -1 ? colors[1] : colors[2]));
        var f2 = new THREE.Face3(v + 2, v + 3, v + 1);//, undefined, h00 > -1 ? colors[1] : colors[2]));
        f1.color = f2.color = h00 < 0.5 ? this.colors[1] : h00 > 1 ? this.colors[0] : this.colors[2];
        this.mesh.geometry.faces.push(f1, f2);
    }

}