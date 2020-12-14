export function degToRad(degrees) {
    return (Math.PI / 180) * degrees;
}

export function radToDeg(radians) {
    return (180 / Math.PI) * radians;
}

export function calcYIntercept(m, x, y) {
    // line eq. is "y = mx + b". Solve for b.
    const b = y - (m * x);
    return b;
}

export function calcSlopeFromHeading(heading) {
    let slope = 0;
    switch (heading) {
        case 0:
        case 180:
            slope = NaN;
            break;
        case 90:
        case 180:
            slope = 0;
        case 45:
        case 225:
            slope = 1;
            break;
        case 135:
        case 315:
            slope = -1;
            break;
        default:
            const headingRad = degToRad(heading);
            slope = 1 / Math.tan(headingRad);
            break;
    }

    return slope;
}

export function slopeFromHeading(heading) {
    const slopes = [
        NaN, 57.28996163075943, 28.636253282915604, 19.081136687728208, 14.300666256711928, 11.430052302761345, 9.514364454222584, 8.144346427974593, 7.11536972238421, 6.313751514675044, 5.671281819617709, 5.144554015970311, 4.704630109478455, 4.3314758742841555, 4.010780933535845, 3.7320508075688776, 3.4874144438409087, 3.2708526184841404, 3.077683537175254, 2.9042108776758226, 2.7474774194546225, 2.605089064693802, 2.475086853416296, 2.3558523658237527, 2.246036773904216, 2.1445069205095586, 2.0503038415792965, 1.9626105055051506, 1.880726465346332, 1.8040477552714238, 1.7320508075688776, 1.6642794823505183, 1.6003345290410504, 1.5398649638145832, 1.48256096851274, 1.4281480067421146, 1.3763819204711736, 1.32704482162041, 1.2799416321930785, 1.2348971565350515, 1.1917535925942102, 1.1503684072210096, 1.110612514829193, 1.0723687100246826, 1.0355303137905696,
        1.0, 0.9656887748070742, 0.9325150861376617, 0.90040404429784, 0.8692867378162269, 0.8390996311772801, 0.8097840331950074, 0.7812856265067174, 0.7535540501027943, 0.7265425280053611, 0.7002075382097099, 0.6745085168424269, 0.6494075931975105, 0.6248693519093275, 0.6008606190275603, 0.577350269189626, 0.5543090514527691, 0.5317094316614789, 0.5095254494944289, 0.4877325885658614, 0.4663076581549986, 0.4452286853085361, 0.4244748162096047, 0.40402622583515674, 0.3838640350354159, 0.3639702342662025, 0.3443276132896654, 0.32491969623290634, 0.3057306814586604, 0.2867453857588079, 0.2679491924311227, 0.24932800284318063, 0.23086819112556303, 0.21255656167002226, 0.1943803091377186, 0.17632698070846503, 0.15838444032453633, 0.14054083470239145, 0.1227845609029046, 0.10510423526567644, 0.08748866352592395, 0.06992681194351036, 0.05240777928304134, 0.03492076949174784, 0.017455064928217672,
        0, -0.017455064928217547, -0.034920769491747716, -0.05240777928304122, -0.06992681194351046, -0.08748866352592406, -0.10510423526567655, -0.12278456090290447, -0.14054083470239134, -0.15838444032453622, -0.17632698070846492, -0.19438030913771848, -0.2125565616700221, -0.23086819112556317, -0.24932800284318074, -0.26794919243112275, -0.2867453857588078, -0.3057306814586603, -0.32491969623290623, -0.3443276132896652, -0.36397023426620234, -0.38386403503541583, -0.40402622583515685, -0.42447481620960487, -0.44522868530853627, -0.4663076581549984, -0.4877325885658616, -0.5095254494944288, -0.5317094316614789, -0.5543090514527689, -0.5773502691896254, -0.6008606190275603, -0.6248693519093272, -0.6494075931975105, -0.6745085168424263, -0.7002075382097099, -0.7265425280053608, -0.7535540501027943, -0.7812856265067173, -0.8097840331950067, -0.8390996311772798, -0.8692867378162265, -0.90040404429784, -0.9325150861376613, -0.9656887748070742,
        -1.0, -1.03553031379057, -1.0723687100246826, -1.1106125148291923, -1.1503684072210096, -1.1917535925942095, -1.2348971565350515, -1.2799416321930783, -1.3270448216204105, -1.3763819204711731, -1.428148006742115, -1.48256096851274, -1.539864963814582, -1.6003345290410504, -1.6642794823505171, -1.7320508075688776, -1.8040477552714234, -1.8807264653463323, -1.9626105055051501, -2.050303841579297, -2.144506920509558, -2.2460367739042146, -2.3558523658237527, -2.475086853416294, -2.605089064693802, -2.7474774194546208, -2.9042108776758235, -3.0776835371752522, -3.270852618484142, -3.4874144438409083, -3.7320508075688736, -4.010780933535845, -4.331475874284151, -4.7046301094784555, -5.144554015970306, -5.671281819617713, -6.3137515146750385, -7.115369722384217, -8.14434642797459, -9.51436445422256, -11.430052302761341, -14.300666256711882, -19.08113668772822, -28.63625328291546, -57.28996163075968,
        NaN, 57.28996163075902, 28.636253282915668, 19.08113668772831, 14.300666256711933, 11.430052302761373, 9.514364454222584, 8.144346427974606, 7.115369722384204, 6.313751514675048, 5.671281819617705, 5.144554015970312, 4.70463010947845, 4.331475874284156, 4.010780933535848, 3.7320508075688767, 3.487414443840911, 3.27085261848414, 3.077683537175255, 2.9042108776758213, 2.747477419454623, 2.6050890646938, 2.475086853416296, 2.3558523658237545, 2.246036773904216, 2.1445069205095595, 2.050303841579296, 1.962610505505151, 1.8807264653463316, 1.8040477552714245, 1.7320508075688767, 1.6642794823505183, 1.6003345290410511, 1.5398649638145832, 1.482560968512741, 1.4281480067421142, 1.3763819204711738, 1.3270448216204098, 1.2799416321930792, 1.2348971565350508, 1.1917535925942102, 1.15036840722101, 1.110612514829193, 1.072368710024683, 1.0355303137905694,
        1.0, 0.9656887748070739, 0.9325150861376619, 0.9004040442978398, 0.8692867378162269, 0.8390996311772805, 0.8097840331950079, 0.7812856265067173, 0.7535540501027942, 0.7265425280053611, 0.7002075382097103, 0.6745085168424262, 0.6494075931975105, 0.6248693519093277, 0.6008606190275608, 0.5773502691896265, 0.5543090514527687, 0.5317094316614787, 0.509525449494429, 0.4877325885658619, 0.46630765815499814, 0.445228685308536, 0.42447481620960487, 0.4040262258351571, 0.38386403503541633, 0.36397023426620206, 0.3443276132896652, 0.3249196962329065, 0.3057306814586607, 0.2867453857588076, 0.26794919243112253, 0.2493280028431808, 0.23086819112556345, 0.21255656167002263, 0.19438030913771825, 0.17632698070846495, 0.1583844403245365, 0.14054083470239184, 0.12278456090290428, 0.10510423526567632, 0.08748866352592408, 0.0699268119435107, 0.05240777928304168, 0.034920769491747515, 0.017455064928217568,
        0, -0.0174550649282172, -0.034920769491748035, -0.05240777928304132, -0.06992681194351033, -0.08748866352592372, -0.10510423526567599, -0.1227845609029048, -0.14054083470239143, -0.1583844403245361, -0.17632698070846456, -0.1943803091377188, -0.21255656167002224, -0.23086819112556303, -0.24932800284318035, -0.2679491924311222, -0.28674538575880815, -0.3057306814586604, -0.32491969623290606, -0.34432761328966477, -0.36397023426620273, -0.3838640350354159, -0.40402622583515674, -0.42447481620960437, -0.44522868530853554, -0.46630765815499886, -0.4877325885658614, -0.5095254494944286, -0.5317094316614782, -0.5543090514527692, -0.5773502691896258, -0.6008606190275602, -0.624869351909327, -0.6494075931975098, -0.6745085168424269, -0.7002075382097097, -0.7265425280053606, -0.7535540501027934, -0.7812856265067178, -0.8097840331950074, -0.8390996311772798, -0.8692867378162261, -0.9004040442978388, -0.9325150861376619, -0.9656887748070739,
        -1.0, -1.0355303137905687, -1.0723687100246833, -1.110612514829193, -1.1503684072210092, -1.1917535925942093, -1.2348971565350502, -1.2799416321930792, -1.32704482162041, -1.3763819204711731, -1.4281480067421135, -1.4825609685127412, -1.5398649638145834, -1.60033452904105, -1.6642794823505167, -1.732050807568875, -1.8040477552714247, -1.880726465346332, -1.9626105055051497, -2.0503038415792942, -2.1445069205095604, -2.246036773904217, -2.355852365823752, -2.4750868534162938, -2.605089064693797, -2.7474774194546243, -2.9042108776758226, -3.0776835371752513, -3.2708526184841364, -3.4874144438409114, -3.732050807568878, -4.010780933535842, -4.331475874284148, -4.704630109478442, -5.144554015970314, -5.6712818196177075, -6.313751514675033, -7.115369722384186, -8.144346427974611, -9.514364454222589, -11.430052302761325, -14.300666256711857, -19.081136687728016, -28.636253282915728, -57.289961630759265
    ];

    return slopes[heading];
}

export function inverseSlopeFromHeading(heading) {
    const slopes = [
        0, 0.017455064928217585, 0.03492076949174773, 0.05240777928304121, 0.06992681194351041, 0.087488663525924, 0.10510423526567647, 0.1227845609029046, 0.14054083470239143, 0.15838444032453627, 0.17632698070846498, 0.19438030913771848, 0.21255656167002213, 0.23086819112556312, 0.2493280028431807, 0.2679491924311227, 0.2867453857588079, 0.3057306814586604, 0.3249196962329063, 0.34432761328966527, 0.36397023426620234, 0.3838640350354158, 0.4040262258351568, 0.42447481620960476, 0.44522868530853615, 0.46630765815499864, 0.4877325885658614, 0.5095254494944288, 0.5317094316614788, 0.554309051452769, 0.5773502691896256, 0.6008606190275603, 0.6248693519093275, 0.6494075931975105, 0.6745085168424267, 0.7002075382097097, 0.7265425280053609, 0.7535540501027942, 0.7812856265067175, 0.809784033195007, 0.8390996311772798, 0.8692867378162267, 0.9004040442978399, 0.9325150861376617, 0.9656887748070739,
        1.0, 1.0355303137905694, 1.0723687100246826, 1.1106125148291928, 1.1503684072210092, 1.1917535925942098, 1.234897156535051, 1.2799416321930788, 1.3270448216204098, 1.3763819204711731, 1.4281480067421142, 1.4825609685127399, 1.539864963814583, 1.6003345290410504, 1.6642794823505183, 1.7320508075688767, 1.8040477552714234, 1.8807264653463316, 1.9626105055051504, 2.0503038415792965, 2.1445069205095586, 2.2460367739042164, 2.355852365823753, 2.4750868534162964, 2.605089064693801, 2.747477419454621, 2.9042108776758218, 3.077683537175253, 3.2708526184841404, 3.487414443840909, 3.7320508075688776, 4.0107809335358455, 4.331475874284157, 4.704630109478451, 5.144554015970307, 5.6712818196177075, 6.313751514675041, 7.115369722384208, 8.144346427974593, 9.514364454222587, 11.43005230276135, 14.30066625671194, 19.08113668772816, 28.636253282915515, 57.289961630759144,
        NaN, -57.28996163075956, -28.636253282915618, -19.081136687728208, -14.300666256711919, -11.430052302761336, -9.514364454222576, -8.144346427974602, -7.115369722384214, -6.313751514675046, -5.671281819617711, -5.144554015970311, -4.704630109478455, -4.331475874284155, -4.010780933535844, -3.7320508075688763, -3.4874144438409105, -3.2708526184841418, -3.0776835371752544, -2.904210877675823, -2.7474774194546225, -2.6050890646938014, -2.4750868534162955, -2.3558523658237522, -2.2460367739042155, -2.1445069205095595, -2.0503038415792956, -1.9626105055051508, -1.8807264653463314, -1.8040477552714242, -1.7320508075688783, -1.6642794823505183, -1.6003345290410511, -1.539864963814583, -1.482560968512741, -1.4281480067421142, -1.3763819204711738, -1.3270448216204098, -1.279941632193079, -1.2348971565350522, -1.1917535925942102, -1.1503684072210099, -1.1106125148291928, -1.072368710024683, -1.0355303137905694,
        -1.0, -0.9656887748070736, -0.9325150861376617, -0.9004040442978404, -0.8692867378162267, -0.8390996311772804, -0.809784033195007, -0.7812856265067176, -0.7535540501027939, -0.7265425280053611, -0.7002075382097095, -0.6745085168424267, -0.649407593197511, -0.6248693519093275, -0.6008606190275607, -0.5773502691896256, -0.5543090514527691, -0.5317094316614787, -0.5095254494944289, -0.48773258856586127, -0.4663076581549987, -0.4452286853085365, -0.42447481620960476, -0.40402622583515707, -0.3838640350354157, -0.36397023426620256, -0.34432761328966516, -0.32491969623290645, -0.3057306814586602, -0.286745385758808, -0.267949192431123, -0.2493280028431807, -0.23086819112556334, -0.21255656167002207, -0.19438030913771864, -0.17632698070846486, -0.1583844403245364, -0.1405408347023913, -0.12278456090290467, -0.10510423526567673, -0.08748866352592402, -0.06992681194351064, -0.05240777928304118, -0.034920769491747904, -0.01745506492821751,
        0, 0.01745506492821771, 0.034920769491747654, 0.05240777928304093, 0.06992681194351039, 0.08748866352592377, 0.10510423526567649, 0.1227845609029044, 0.14054083470239154, 0.15838444032453616, 0.17632698070846511, 0.19438030913771842, 0.21255656167002232, 0.2308681911255631, 0.24932800284318046, 0.26794919243112275, 0.28674538575880776, 0.30573068145866045, 0.3249196962329062, 0.34432761328966544, 0.3639702342662023, 0.383864035035416, 0.4040262258351568, 0.4244748162096045, 0.44522868530853615, 0.46630765815499836, 0.4877325885658615, 0.5095254494944287, 0.5317094316614789, 0.5543090514527688, 0.577350269189626, 0.6008606190275603, 0.6248693519093272, 0.6494075931975105, 0.6745085168424263, 0.7002075382097099, 0.7265425280053608, 0.7535540501027943, 0.7812856265067172, 0.8097840331950075, 0.8390996311772798, 0.8692867378162263, 0.9004040442978399, 0.9325150861376613, 0.9656887748070743,
        1.0, 1.0355303137905696, 1.0723687100246824, 1.110612514829193, 1.1503684072210092, 1.1917535925942093, 1.2348971565350502, 1.279941632193079, 1.32704482162041, 1.3763819204711731, 1.4281480067421135, 1.4825609685127412, 1.5398649638145832, 1.60033452904105, 1.6642794823505167, 1.7320508075688752, 1.8040477552714247, 1.8807264653463323, 1.96261050550515, 2.0503038415792942, 2.144506920509561, 2.246036773904217, 2.3558523658237522, 2.4750868534162938, 2.605089064693798, 2.7474774194546243, 2.904210877675823, 3.077683537175252, 3.270852618484137, 3.487414443840913, 3.7320508075688794, 4.010780933535843, 4.331475874284149, 4.704630109478443, 5.144554015970316, 5.67128181961771, 6.313751514675035, 7.115369722384188, 8.144346427974614, 9.514364454222598, 11.430052302761334, 14.30066625671187, 19.081136687728037, 28.63625328291578, 57.28996163075948,
        NaN, -57.289961630760686, -28.63625328291535, -19.08113668772817, -14.300666256711946, -11.43005230276138, -9.514364454222628, -8.14434642797458, -7.11536972238421, -6.313751514675051, -5.671281819617723, -5.144554015970302, -4.704630109478452, -4.331475874284157, -4.01078093353585, -3.7320508075688847, -3.487414443840906, -3.2708526184841404, -3.077683537175256, -2.9042108776758266, -2.7474774194546194, -2.605089064693801, -2.4750868534162964, -2.355852365823755, -2.246036773904219, -2.1445069205095573, -2.0503038415792965, -1.9626105055051515, -1.8807264653463338, -1.804047755271423, -1.7320508075688772, -1.6642794823505185, -1.6003345290410516, -1.5398649638145847, -1.4825609685127397, -1.4281480067421146, -1.3763819204711742, -1.3270448216204114, -1.279941632193078, -1.234897156535051, -1.1917535925942102, -1.1503684072210103, -1.1106125148291943, -1.0723687100246824, -1.0355303137905696,
        -1.0, -0.9656887748070748, -0.9325150861376611, -0.9004040442978398, -0.8692867378162269, -0.8390996311772805, -0.8097840331950079, -0.7812856265067172, -0.7535540501027942, -0.7265425280053611, -0.7002075382097103, -0.6745085168424262, -0.6494075931975104, -0.6248693519093277, -0.6008606190275608, -0.5773502691896265, -0.5543090514527687, -0.5317094316614788, -0.509525449494429, -0.48773258856586194, -0.46630765815499825, -0.44522868530853604, -0.4244748162096049, -0.4040262258351571, -0.38386403503541644, -0.3639702342662021, -0.34432761328966527, -0.32491969623290656, -0.3057306814586608, -0.2867453857588077, -0.26794919243112264, -0.24932800284318085, -0.23086819112556348, -0.21255656167002268, -0.19438030913771834, -0.17632698070846503, -0.15838444032453655, -0.1405408347023919, -0.12278456090290434, -0.10510423526567642, -0.08748866352592415, -0.06992681194351076, -0.052407779283041744, -0.03492076949174758, -0.017455064928217634
    ];

    return slopes[heading];
}

export function calculateDeparturePoint(x0, y0, heading, bbox, maxDist) {
    const slope = calcSlopeFromHeading(heading);

    let xDif, yDif;

    if (heading < 180) {
        xDif = bbox.right - x0;
    } else {
        xDif = bbox.left - x0;
    }

    if (heading > 270 || heading < 90) {
        yDif = bbox.top - y0;
    } else {
        yDif = bbox.bottom - y0;
    }

    let y1, x1, side;

    x1 = x0 + yDif / slope;
    if (x1 > bbox.right || x1 < bbox.left) {
        // we went out the left or right
        if (xDif < 0) {
            x1 = bbox.left;
            side = 'left';
        } else {
            x1 = bbox.right;
            side = 'right'
        }

        y1 = y0 + (slope * xDif);
    } else {
        // we went out the top or bottom
        x1 = x0 + yDif / slope;

        if (yDif < 0) {
            y1 = bbox.top;
            side = 'top';
        } else {
            y1 = bbox.bottom;
            side = 'bottom';
        }
    }

    let departurePt = { x: x1, y: y1, side: side };
    if (calcDistance(x0, y0, x1, y1) > maxDist) {
        departurePt = null;
    }

    return departurePt;
}

export function calcDistance(x0, y0, x1, y1) {
    return Math.hypot((x1 - x0), (y1 - y0));
}
