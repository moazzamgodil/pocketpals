import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MintApp from '../components/MintApp';
import StakeApp from '../components/StakeApp';
import RouterDom from './RouterDom';

function AppRouter() {
    return (
        <BrowserRouter basename='/paws'>
            <Routes>
                <Route path="/" element={<RouterDom />}>
                    <Route index element={<Navigate to="mint" replace />} />
                    <Route exact path="stake" element={<StakeApp />} />
                    <Route exact path="mint" element={<MintApp />} />
                    <Route
                        path="*"
                        element={<Navigate to="mint" replace />}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;