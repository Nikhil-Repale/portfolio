/* ============================================================
   DEVOPS COMMAND CENTRE — DATA ADDITIONS
   Nikhil Repale Portfolio
   Adds: Advanced Scenarios, Brand Colors, and Missing Tools.
   Load this file AFTER tools-extended.js.
   ============================================================ */

(function () {
    "use strict";

    function waitForData(cb, tries) {
        tries = tries || 0;
        if (window.devopsToolData) return cb();
        if (tries > 50) return; 
        setTimeout(() => waitForData(cb, tries + 1), 100);
    }

    waitForData(function () {
        const D = window.devopsToolData;

        // === OPENSHIFT PAYLOAD ===
        D.openshift = {
            title: "Red Hat OpenShift",
            subtitle: "Enterprise Kubernetes Container Platform",
            category: "Containers",
            brandColor: "#EE0000",
            iconClass: "fas fa-dharmachakra",
            overview: {
                desc: "OpenShift extends Kubernetes with enterprise-grade security, built-in CI/CD, and developer-friendly workflows. It forces strict RBAC and Security Context Constraints (SCC) by default.",
                metrics: [
                    { label: "Base OS", val: "Red Hat CoreOS" },
                    { label: "Security", val: "Strict SCCs" },
                    { label: "Registry", val: "Integrated" },
                    { label: "Pipelines", val: "Tekton Built-in" },
                    { label: "Routing", val: "HAProxy Routes" }
                ],
                concepts: [
                    { name: "Routes", desc: "Exposes services externally (similar to K8s Ingress)." },
                    { name: "ImageStreams", desc: "Abstracts container images to auto-trigger deployments." },
                    { name: "SCCs", desc: "Controls permissions for pods (e.g., prevents running as root)." }
                ]
            },
            commands: [
                { id: "oc-login", cmd: "oc login -u <user> https://api.cluster.com:6443", desc: "Authenticate with the OpenShift cluster API.", cat: "Auth" },
                { id: "oc-project", cmd: "oc project <project-name>", desc: "Switch to a specific project (namespace).", cat: "Basics" },
                { id: "oc-new-app", cmd: "oc new-app <source-repo>", desc: "Create a new application directly from source code.", cat: "Deploy" },
                { id: "oc-expose", cmd: "oc expose svc/<service-name>", desc: "Create a Route to expose a service to external traffic.", cat: "Network" },
                { id: "oc-get-routes", cmd: "oc get routes", desc: "List all external routes and their URLs.", cat: "Network" }
            ],
            scenarios: [
                {
                    title: "Debug: Pod fails with 'CreateContainerError' (Permission Denied)",
                    desc: "OpenShift defaults to strict security. If a Docker image requires root access, OpenShift will block it, resulting in a CreateContainerError.",
                    steps: [
                        { action: "Check pod events for security constraints.", cmd: "oc describe pod <pod-name>" },
                        { action: "If the image requires root, you must grant the 'anyuid' SCC to the pod's ServiceAccount.", cmd: "oc adm policy add-scc-to-user anyuid -z default" },
                        { action: "Delete the failing pod to force a recreation.", cmd: "oc delete pod <pod-name>" }
                    ]
                }
            ]
        };

        // === DIGITALOCEAN PAYLOAD ===
        D.digitalocean = {
            title: "DigitalOcean (DOKS)",
            subtitle: "Developer-Friendly Cloud Infrastructure",
            category: "Cloud",
            brandColor: "#0080FF",
            iconClass: "fas fa-water",
            overview: {
                desc: "DigitalOcean provides simple, scalable cloud computing. I primarily use DO for cost-effective Kubernetes clusters (DOKS), managed databases, and straightforward networking.",
                metrics: [
                    { label: "Compute", val: "Droplets" },
                    { label: "Storage", val: "Spaces (S3 Compatible)" },
                    { label: "K8s", val: "DOKS" },
                    { label: "Networking", val: "VPCs & Cloud Firewalls" },
                    { label: "CLI", val: "doctl" }
                ],
                concepts: [
                    { name: "Droplets", desc: "Linux-based virtual machines." },
                    { name: "App Platform", desc: "PaaS for deploying code directly from GitHub." },
                    { name: "DOKS", desc: "Managed DigitalOcean Kubernetes Service." }
                ]
            },
            commands: [
                { id: "do-auth", cmd: "doctl auth init", desc: "Authenticate the CLI using an API token.", cat: "Auth" },
                { id: "do-create-droplet", cmd: "doctl compute droplet create <name> --region nyc1 --image ubuntu-22-04-x64", desc: "Provision a new VM droplet.", cat: "Compute" },
                { id: "do-k8s-kubeconfig", cmd: "doctl kubernetes cluster kubeconfig save <cluster-id>", desc: "Download Kubeconfig for a DOKS cluster.", cat: "K8s" },
                { id: "do-list-lb", cmd: "doctl compute load-balancer list", desc: "List active Load Balancers.", cat: "Network" }
            ],
            scenarios: [
                {
                    title: "Debug: DOKS LoadBalancer Pending Forever",
                    desc: "When deploying a Service of type LoadBalancer in DOKS, it remains in <pending> state.",
                    steps: [
                        { action: "Check the events of the service for DO Cloud Controller errors.", cmd: "kubectl describe svc <service-name>" },
                        { action: "Verify you haven't hit the DO account limit for Load Balancers.", cmd: "doctl compute load-balancer list" },
                        { action: "Ensure your K8s annotations explicitly request a DO LB.", cmd: "kubectl annotate svc <service-name> service.beta.kubernetes.io/do-loadbalancer-protocol='http'" }
                    ]
                }
            ]
        };


        // Apply Brand Colors to existing tools
        if (D.aws) D.aws.brandColor = "#FF9900";
        if (D.docker) D.docker.brandColor = "#2496ED";
        if (D.kubernetes) D.kubernetes.brandColor = "#326CE5";
        if (D.terraform) D.terraform.brandColor = "#844FBA";
        if (D.jenkins) D.jenkins.brandColor = "#D24939";
        if (D.prometheus) D.prometheus.brandColor = "#E6522C";
        if (D.azure) D.azure.brandColor = "#0078D4";
        if (D.linux) D.linux.brandColor = "#FCC624";
        if (D.git) D.git.brandColor = "#F05032";

        /* ============================================================
           1. NEW TOOL — PODMAN (Daemonless Container Engine)
           ============================================================ */
        D.podman = {
            title: "Podman",
            subtitle: "Daemonless, Rootless Container Engine",
            category: "Containers",
            iconClass: "fas fa-cube",
            brandColor: "#892CA0",
            overview: {
                desc: "Podman is a daemonless container engine — a drop-in replacement for most Docker workflows but without a central root-owned background process.",
                metrics: [
                    { label: "Architecture", val: "Daemonless (Fork/Exec)" },
                    { label: "Default Mode", val: "Rootless" },
                    { label: "Pod Support", val: "Native Kubernetes Pods" }
                ],
                concepts: [],
                interviewPrep: []
            },
            commands: [
                { category: "Basic", cmd: "podman run -d --name web nginx", desc: "Run a container in the background" },
                { category: "Advanced", cmd: "podman generate systemd --new --name web > ~/.config/systemd/user/container-web.service", desc: "Generate systemd service file for auto-starting containers" }
            ],
            scenarios: [
                {
                    title: "Rootless Container Port Binding Failure",
                    category: "Troubleshooting",
                    problem: "Attempting to bind a podman container to port 80 fails with 'permission denied'.",
                    solution: "Rootless containers cannot bind to ports < 1024. Use podman unshare sysctl -w net.ipv4.ip_unprivileged_port_start=80 or bind to 8080 and route traffic via firewalld.",
                    cmd: "sysctl net.ipv4.ip_unprivileged_port_start=80",
                    explanation: "Lowering the unprivileged port start allows the user namespace to bind standard web ports without full root privileges."
                }
            ]
        };

        /* ============================================================
           2. ADVANCED SCENARIOS FOR AWS
           ============================================================ */
        if (D.aws && D.aws.scenarios) {
            D.aws.scenarios.push({
                title: "VPC Peering Asymmetric Routing Drop",
                category: "Networking",
                problem: "Ping works from VPC A to VPC B, but TCP handshakes drop (SYN sent, no SYN-ACK received).",
                solution: "Identify asymmetric routing where returning traffic targets an IGW or NAT instead of the VPC Peering connection. Update route tables in all subnets of VPC B to explicitly route VPC A's CIDR back through the peering connection ID (pcx-xxxx).",
                cmd: "aws ec2 describe-route-tables --filters \"Name=vpc-id,Values=vpc-B\"",
                explanation: "TCP requires stateful routing. If traffic returns via a different path (like an IGW) that didn't see the initial SYN, the firewall drops it as invalid state."
            });
            D.aws.scenarios.push({
                title: "Cross-Account IAM Role Assumption Denied",
                category: "Security",
                problem: "User in Account A gets 'AccessDenied' when calling sts:AssumeRole for a role in Account B.",
                solution: "Both sides must allow it. Account A's IAM Policy must explicitly allow 'sts:AssumeRole' to Account B's Role ARN. Account B's Role Trust Policy (Principal) must explicitly allow Account A's root or user ARN.",
                cmd: "aws sts assume-role --role-arn arn:aws:iam::111222333444:role/CrossAccount --role-session-name test",
                explanation: "IAM cross-account access requires dual-consent: the calling account must grant permission to assume, and the receiving role must trust the caller."
            });
        }

        /* ============================================================
           3. ADVANCED SCENARIOS FOR KUBERNETES
           ============================================================ */
        if (D.kubernetes && D.kubernetes.scenarios) {
            D.kubernetes.scenarios.push({
                title: "Pod Stuck in CrashLoopBackOff",
                category: "Troubleshooting",
                problem: "Deployment rolls out but pods rapidly crash and restart, entering CrashLoopBackOff state.",
                solution: "First check previous logs to see why the application process died. If logs are empty, check the pod's describe events for Liveness Probe failures (Timeout/HTTP 500) causing the kubelet to forcefully kill the container.",
                cmd: "kubectl describe pod <pod-name> && kubectl logs <pod-name> --previous",
                explanation: "The '--previous' flag is critical because the current container is newly restarted and often has no logs. Liveness probes failing will cause SIGKILLs that leave no app logs."
            });
            D.kubernetes.scenarios.push({
                title: "Node Memory Exhaustion (OOMKilled)",
                category: "Performance",
                problem: "Pod exits randomly with Exit Code 137 (OOMKilled) but the node still has available RAM.",
                solution: "The container exceeded its specific memory 'limit' defined in the pod spec. Increase the memory limit, or profile the application for memory leaks. Ensure JVM heaps (Xmx) are set lower than the container limit.",
                cmd: "kubectl describe pod <pod-name> | grep -A 3 'State:          Terminated'",
                explanation: "Exit Code 137 means process received SIGKILL (9). In containers, this is almost always the Linux OOM Killer destroying the process for breaching its cgroup limit."
            });
        }

        /* ============================================================
           4. ADVANCED SCENARIOS FOR DOCKER
           ============================================================ */
        if (D.docker && D.docker.scenarios) {
            D.docker.scenarios.push({
                title: "Docker0 Bridge Network Conflict",
                category: "Networking",
                problem: "Starting Docker breaks SSH access or internal corporate network routing.",
                solution: "Docker's default bridge network (172.17.0.0/16) conflicts with the corporate network subnet. Modify /etc/docker/daemon.json to assign a different 'bip' (Bridge IP) like 10.200.0.1/24.",
                cmd: "cat /etc/docker/daemon.json | grep bip",
                explanation: "Linux routing tables prefer the most specific route. If Docker claims a subnet that overlaps with the LAN, traffic routes locally to the bridge instead of out the gateway."
            });
        }

        /* ============================================================
           5. ADVANCED SCENARIOS FOR TERRAFORM
           ============================================================ */
        if (D.terraform && D.terraform.scenarios) {
            D.terraform.scenarios.push({
                title: "Corrupted Remote State Lock (DynamoDB)",
                category: "State Management",
                problem: "Terraform apply fails with 'Error acquiring the state lock' because a previous CI/CD run crashed.",
                solution: "Verify no one is actually applying. Use terraform force-unlock with the Lock ID provided in the error message to remove the stale lock from the DynamoDB table.",
                cmd: "terraform force-unlock <LOCK_ID>",
                explanation: "State locking prevents concurrent modifications which can corrupt remote state (like S3 backend). Force unlocking should only be done if you are 100% sure the locking process is dead."
            });
        }

        /* ============================================================
           6. ADVANCED SCENARIOS FOR LINUX
           ============================================================ */
        if (D.linux && D.linux.scenarios) {
            D.linux.scenarios.push({
                title: "High iowait CPU Bottleneck",
                category: "Performance",
                problem: "Server load average is heavily spiking (e.g., 20.0 on a 4-core machine), but 'top' shows low user CPU (us) and high iowait (wa).",
                solution: "The CPU is idle but blocked waiting on slow disk I/O. Use 'iotop' to identify the specific process hammering the disk. If it's a database, check for missing indexes causing full table scans.",
                cmd: "iotop -oPa",
                explanation: "iowait means the CPU is ready to process data but the physical disk storage cannot read/write fast enough to feed the CPU."
            });
        }


        // Generate dynamic CSS for selector buttons based on brand colors
        let styleStr = '<style id="dynamic-tool-colors">';
        for (const key in D) {
            if (D[key].brandColor) {
                const hex = D[key].brandColor;
                // Convert hex to rgb for rgba usage
                const r = parseInt(hex.slice(1,3), 16);
                const g = parseInt(hex.slice(3,5), 16);
                const b = parseInt(hex.slice(5,7), 16);
                styleStr += `
                    .selector-btn[data-tool="${key}"].active {
                        border-left-color: ${hex} !important;
                        background: rgba(${r}, ${g}, ${b}, 0.1) !important;
                        color: ${hex} !important;
                    }
                    .selector-btn[data-tool="${key}"]:hover {
                        border-left-color: rgba(${r}, ${g}, ${b}, 0.5) !important;
                        background: rgba(${r}, ${g}, ${b}, 0.05) !important;
                    }
                    .selector-btn[data-tool="${key}"] i {
                        color: ${hex} !important;
                    }
                `;
            }
        }
        styleStr += '</style>';
        document.head.insertAdjacentHTML('beforeend', styleStr);

    });
})();