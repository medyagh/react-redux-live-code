import React from 'react';
import * as Corners from 'Constants/Corners'
import * as Sides from 'Constants/Sides'
import Corner from 'Components/Board/Tile/Corner';
import Side from 'Components/Board/Tile/Side';
import * as BoardUtils from 'Utils/BoardUtils';

function Tile(props) {
    function renderCorner(cornerLocation) {
        return (
            <Corner key={cornerLocation} cornerLocation={cornerLocation} />
        )
    }
    
    function renderSide(side) {
        const baseX = (props.colNum * 2);
        const baseY = props.rowNum;
        
        const claimTile = () => {
            props.claimTile(
                baseX + BoardUtils.getOffsetX(side), 
                baseY + BoardUtils.getOffsetY(side)
            );
        };

        const owningPlayerNumber = BoardUtils.getOwningPlayerNumber(
            baseX,
            baseY,
            side,
            props.tiles
        );

        return (
            <Side
                key={side}
                side={side}
                owningPlayerNumber={owningPlayerNumber}
                claimTile={claimTile}
            />
        );
    }


    const tileClasses = ['tile'];

    const renderedCorners = [
        renderCorner(Corners.TOP_LEFT)
    ];
    const renderedSides = [
        renderSide(Sides.TOP),
        renderSide(Sides.LEFT)
    ];

    if (props.sides.hasOwnProperty(Sides.RIGHT)) {
        renderedCorners.push(renderCorner(Corners.TOP_RIGHT));
        renderedCorners.push(renderCorner(Corners.BOTTOM_RIGHT));

        renderedSides.push(renderSide(Sides.RIGHT));
    }
    if (props.sides.hasOwnProperty(Sides.BOTTOM)) {
        renderedCorners.push(renderCorner(Corners.BOTTOM_LEFT));

        renderedSides.push(renderSide(Sides.BOTTOM));        
    }

    return (
        <div className={tileClasses.join(' ')}>
            {renderedCorners}
            {renderedSides}
        </div>
    );
}

Tile.propTypes = {
    sides: React.PropTypes.objectOf(React.PropTypes.number).isRequired,
    claimTile: React.PropTypes.func.isRequired,
    tiles: React.PropTypes.object.isRequired,
    rowNum: React.PropTypes.number.isRequired,
    colNum: React.PropTypes.number.isRequired,
};


export default Tile;