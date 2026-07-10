/**
 * DevOps Command Centre — Standalone Controller
 * 100% self-contained. No dependency on script.js, window.devopsToolData,
 * or any other file. All data, CSS, and logic is here.
 */
(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════════════════
     1. INJECT SCOPED CSS
  ═══════════════════════════════════════════════════════════════════ */
  const style = document.createElement('style');
  style.textContent = `
    .cc-selector-label{color:#94a3b8;font-size:1.4rem;margin-bottom:1.8rem;text-align:center}
    .cc-tool-grid{display:flex;flex-wrap:wrap;gap:.8rem;justify-content:center;margin-bottom:2.5rem}
    .cc-tool-btn{display:flex;align-items:center;gap:.6rem;padding:.7rem 1.4rem;
      background:rgba(26,34,53,.8);border:1px solid #1e2d45;color:#94a3b8;
      border-radius:8px;cursor:pointer;font-size:1.3rem;font-weight:600;
      transition:all .2s ease;font-family:inherit}
    .cc-tool-btn:hover{border-color:#6366f1;color:#818cf8;background:rgba(99,102,241,.08)}
    .cc-tool-btn.active{border-color:#6366f1;color:#818cf8;background:rgba(99,102,241,.12)}
    .cc-tool-btn i{font-size:1.5rem}

    .cc-hub-card{background:#111827;border:1px solid #1e2d45;border-radius:14px;overflow:hidden;margin-top:1rem}
    .cc-hub-header{display:flex;align-items:center;justify-content:space-between;
      padding:2rem 2.5rem;border-bottom:1px solid #1e2d45;background:rgba(17,24,39,.9)}
    .cc-hub-tool-info{display:flex;align-items:center;gap:1.4rem}
    .cc-hub-icon{width:48px;height:48px;border-radius:10px;background:rgba(99,102,241,.15);
      border:1px solid rgba(99,102,241,.3);display:flex;align-items:center;justify-content:center;font-size:2.2rem}
    .cc-hub-icon i{color:#818cf8}
    .cc-hub-header h3{color:#f1f5f9;font-size:1.8rem;font-weight:700;margin:0}
    .cc-hub-header p{color:#64748b;font-size:1.3rem;margin:.2rem 0 0}
    .cc-hub-badge{background:rgba(99,102,241,.12);color:#818cf8;border:1px solid rgba(99,102,241,.25);
      padding:.35rem .9rem;border-radius:6px;font-size:1.15rem;font-weight:600}

    .cc-tabs{display:flex;background:rgba(10,14,26,.8);border-bottom:1px solid #1e2d45;overflow-x:auto}
    .cc-tab{background:none;border:none;border-bottom:3px solid transparent;
      color:#64748b;padding:1.4rem 2rem;font-size:1.35rem;font-weight:600;
      cursor:pointer;display:flex;align-items:center;gap:.6rem;white-space:nowrap;
      transition:all .2s ease;font-family:inherit}
    .cc-tab:hover{color:#818cf8;border-bottom-color:rgba(129,140,248,.3)}
    .cc-tab.active{color:#818cf8;border-bottom-color:#6366f1}
    .cc-tab i{font-size:1.3rem}

    .cc-panel{display:none;padding:2.5rem;animation:ccFade .3s ease}
    .cc-panel.active{display:block}
    @keyframes ccFade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}

    /* Overview */
    .cc-overview-grid{display:grid;grid-template-columns:1fr 1fr;gap:2rem;margin-bottom:2rem}
    .cc-overview-left h4,.cc-overview-right h4{color:#f1f5f9;font-size:1.4rem;margin-bottom:1rem}
    .cc-overview-left p{color:#94a3b8;font-size:1.35rem;line-height:1.7;margin-bottom:1.5rem}
    .cc-metrics{display:grid;grid-template-columns:repeat(2,1fr);gap:.8rem}
    .cc-metric{background:#1a2235;border:1px solid #1e2d45;border-radius:8px;padding:1rem 1.2rem}
    .cc-metric strong{color:#818cf8;font-size:1.3rem;display:block}
    .cc-metric span{color:#64748b;font-size:1.1rem}
    .cc-concepts{list-style:none;padding:0;display:flex;flex-direction:column;gap:.8rem}
    .cc-concepts li{background:#1a2235;border:1px solid #1e2d45;border-radius:8px;
      padding:1rem 1.2rem;color:#94a3b8;font-size:1.3rem;display:flex;align-items:flex-start;gap:.8rem}
    .cc-concepts li i{color:#6366f1;margin-top:.15rem;flex-shrink:0}
    .cc-concepts li strong{color:#e2e8f0;display:block;margin-bottom:.2rem}

    .cc-interview h4{color:#f1f5f9;font-size:1.4rem;margin-bottom:1.2rem}
    .cc-qna{background:#1a2235;border:1px solid #1e2d45;border-radius:10px;padding:1.4rem;margin-bottom:1rem}
    .cc-qna-q{color:#e2e8f0;font-weight:700;font-size:1.3rem;margin-bottom:.8rem}
    .cc-qna-q span{background:#6366f1;color:#fff;border-radius:4px;padding:.1rem .5rem;font-size:1.1rem;margin-right:.6rem}
    .cc-qna-a{color:#94a3b8;font-size:1.3rem;line-height:1.6;margin-bottom:.8rem}
    .cc-qna-a span{background:#22d3ee22;color:#22d3ee;border-radius:4px;padding:.1rem .5rem;font-size:1.1rem;margin-right:.6rem}
    .cc-qna-tip{color:#a3be8c;font-size:1.2rem;font-style:italic;border-left:3px solid #a3be8c;padding-left:.8rem}

    /* Troubleshooting */
    .cc-trouble-layout{display:grid;grid-template-columns:280px 1fr;gap:1.5rem;min-height:500px}
    .cc-scenario-sidebar h4{color:#f1f5f9;font-size:1.3rem;margin-bottom:.8rem}
    .cc-scenario-filter{display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:1rem}
    .cc-filter-btn{background:transparent;border:1px solid #1e2d45;color:#64748b;
      border-radius:5px;padding:.3rem .7rem;font-size:1.1rem;cursor:pointer;
      transition:all .2s ease;font-family:inherit}
    .cc-filter-btn.active,.cc-filter-btn:hover{border-color:#6366f1;color:#818cf8;background:rgba(99,102,241,.08)}
    .cc-scenario-list{display:flex;flex-direction:column;gap:.5rem;overflow-y:auto;max-height:450px}
    .cc-sc-btn{background:#1a2235;border:1px solid #1e2d45;color:#94a3b8;border-radius:8px;
      padding:.9rem 1.1rem;font-size:1.25rem;font-weight:600;cursor:pointer;text-align:left;
      transition:all .2s ease;font-family:inherit;width:100%}
    .cc-sc-btn:hover,.cc-sc-btn.active{border-color:#6366f1;color:#818cf8;background:rgba(99,102,241,.1)}
    .cc-sc-category{font-size:1rem;color:#6366f1;text-transform:uppercase;letter-spacing:.5px;display:block;margin-top:.2rem}

    .cc-terminal-area{display:flex;flex-direction:column;gap:1rem}
    .cc-terminal{background:#060912;border-radius:10px;overflow:hidden;border:1px solid #1e2d45}
    .cc-terminal-header{display:flex;align-items:center;padding:.8rem 1.2rem;
      background:#0d1117;border-bottom:1px solid #1e2d45;gap:1rem}
    .cc-dots{display:flex;gap:.5rem}
    .cc-dot{width:12px;height:12px;border-radius:50%}
    .cc-terminal-title{color:#4b5563;font-size:1.2rem;font-family:'Fira Code',monospace;flex:1}
    .cc-term-actions{display:flex;gap:.6rem}
    .cc-term-actions button{background:rgba(99,102,241,.1);border:1px solid rgba(99,102,241,.2);
      color:#818cf8;border-radius:5px;padding:.35rem .8rem;font-size:1.2rem;cursor:pointer;
      transition:all .2s ease;font-family:inherit}
    .cc-term-actions button:hover{background:#6366f1;color:#fff}
    .cc-run-btn{background:rgba(52,211,153,.1)!important;border-color:rgba(52,211,153,.25)!important;color:#34d399!important}
    .cc-run-btn:hover{background:#34d399!important;color:#000!important}
    .cc-terminal-body{padding:1.4rem;min-height:200px;max-height:300px;overflow-y:auto;font-family:'Fira Code',monospace;font-size:1.25rem}
    .cc-term-line{margin-bottom:.5rem;line-height:1.5}
    .cc-prompt{color:#6366f1;margin-right:.5rem}
    .cc-placeholder{color:#374151}
    .cc-cmd-text{color:#e2e8f0}
    .cc-out-log{color:#94a3b8}
    .cc-out-success{color:#34d399}
    .cc-out-error{color:#f87171}
    .cc-out-warning{color:#fbbf24}
    .cc-out-info{color:#22d3ee}
    .cc-cursor{border-right:2px solid #818cf8;animation:blink .7s infinite}
    @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}

    .cc-explanation-card{background:#1a2235;border:1px solid #1e2d45;border-radius:10px;padding:1.5rem}
    .cc-explanation-card h5{color:#818cf8;font-size:1.35rem;margin-bottom:.8rem}
    .cc-explanation-card h5 i{margin-right:.5rem;color:#fbbf24}
    .cc-explanation-card p{color:#94a3b8;font-size:1.3rem;line-height:1.7}

    /* Commands */
    .cc-commands-toolbar{display:flex;flex-direction:column;gap:1rem;margin-bottom:1.5rem}
    .cc-search-box{display:flex;align-items:center;gap:.8rem;background:#1a2235;
      border:1px solid #1e2d45;border-radius:8px;padding:.8rem 1.2rem}
    .cc-search-box i{color:#64748b}
    .cc-search-box input{background:none;border:none;outline:none;color:#e2e8f0;
      font-size:1.35rem;width:100%;font-family:inherit}
    .cc-search-box input::placeholder{color:#374151}
    .cc-cmd-filters{display:flex;flex-wrap:wrap;gap:.5rem}
    .cc-filter-pill{background:#1a2235;border:1px solid #1e2d45;color:#64748b;
      border-radius:6px;padding:.35rem .9rem;font-size:1.2rem;cursor:pointer;
      transition:all .2s ease;font-family:inherit}
    .cc-filter-pill.active,.cc-filter-pill:hover{border-color:#6366f1;color:#818cf8}
    .cc-cmd-list{display:grid;gap:.8rem}
    .cc-cmd-card{background:#1a2235;border:1px solid #1e2d45;border-radius:8px;padding:1.3rem}
    .cc-cmd-card-top{display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;margin-bottom:.6rem}
    .cc-cmd-syntax{color:#34d399;font-family:'Fira Code',monospace;font-size:1.25rem;word-break:break-all}
    .cc-cmd-copy{background:rgba(99,102,241,.1);border:1px solid rgba(99,102,241,.2);color:#818cf8;
      border-radius:5px;padding:.3rem .7rem;font-size:1.15rem;cursor:pointer;white-space:nowrap;font-family:inherit}
    .cc-cmd-copy:hover{background:#6366f1;color:#fff}
    .cc-cmd-desc{color:#94a3b8;font-size:1.25rem;margin:.4rem 0}
    .cc-cmd-tag{background:rgba(99,102,241,.08);color:#6366f1;border-radius:5px;padding:.2rem .6rem;font-size:1.1rem}
    .cc-cmd-count{color:#475569;font-size:1.2rem;margin-top:1rem;text-align:right}

    @media(max-width:768px){
      .cc-overview-grid{grid-template-columns:1fr}
      .cc-trouble-layout{grid-template-columns:1fr}
      .cc-scenario-sidebar{max-height:250px;overflow-y:auto}
    }
  `;
  document.head.appendChild(style);

  /* ═══════════════════════════════════════════════════════════════════
     2. TOOL DATA (all self-contained)
  ═══════════════════════════════════════════════════════════════════ */
  const TOOLS = {
    aws: {
      title:'Amazon Web Services', subtitle:'Cloud Infrastructure & Scalable Services',
      category:'Infrastructure', icon:'fab fa-aws',
      desc:'AWS is the backbone of my cloud work. I provision VPCs, EC2 instances, S3 buckets, RDS databases, and manage IAM policies for secure access. I\'ve used CloudWatch for alerting and Auto Scaling groups for handling traffic spikes in production.',
      metrics:[
        {label:'Compute',val:'EC2 / Lambda'},{label:'Storage',val:'S3 / EBS'},
        {label:'Networking',val:'VPC / Route53'},{label:'Security',val:'IAM / KMS'},
        {label:'Container',val:'ECS / ECR'},{label:'Monitor',val:'CloudWatch'}
      ],
      concepts:[
        {icon:'fas fa-lock',title:'IAM (Identity & Access Management)',desc:'Controls who can access what. I create least-privilege roles for EC2, Lambda, and CI/CD pipelines.'},
        {icon:'fas fa-network-wired',title:'VPC & Subnets',desc:'Isolated network environments. I design public/private subnet splits with NAT Gateways for outbound traffic.'},
        {icon:'fas fa-server',title:'EC2 & Auto Scaling',desc:'Virtual servers with automatic scaling based on CPU/memory alarms. I\'ve configured ASGs for 3-tier apps.'},
        {icon:'fas fa-hdd',title:'S3 & Storage',desc:'Object storage for static assets, backups, and Terraform state files with versioning and bucket policies.'}
      ],
      interview:[
        {q:'How do you secure an EC2 instance on AWS?',a:'Use IAM roles instead of access keys, restrict Security Groups to least-privilege ports, enable SSM Session Manager to avoid SSH exposure, and encrypt EBS volumes with KMS.',tip:'Mention "no open port 22 to 0.0.0.0/0" — shows production awareness.'},
        {q:'What is the difference between Security Groups and NACLs?',a:'Security Groups are stateful (return traffic allowed automatically) and applied at instance level. NACLs are stateless (you must allow both inbound and outbound) and applied at subnet level.',tip:'Say you use NACLs as a coarse subnet firewall and SGs as fine-grained instance firewall.'}
      ],
      scenarios:[
        {id:'aws_ec2_unreachable',category:'network',name:'EC2 Instance Unreachable',
          cmd:'aws ec2 describe-instance-status --instance-ids i-0abcd1234\naws ec2 describe-security-groups --group-ids sg-0abc123\ncurl -v --max-time 5 http://13.56.12.200',
          explanation:'Production EC2 instance stopped responding after a security group rule update. I ran describe-instance-status to confirm the instance was running, then describe-security-groups and found port 80 was accidentally removed from inbound rules. Added the rule back via CLI and traffic resumed in 30 seconds.',
          output:[
            {t:'prompt',v:'aws ec2 describe-instance-status --instance-ids i-0abcd1234'},
            {t:'log',v:'InstanceState: running | SystemStatus: ok | InstanceStatus: ok'},
            {t:'prompt',v:'aws ec2 describe-security-groups --group-ids sg-0abc123'},
            {t:'error',v:'INBOUND RULES: Port 22 (SSH) ✓  |  Port 80 (HTTP) ✗ MISSING  |  Port 443 (HTTPS) ✓'},
            {t:'warning',v:'⚠ Port 80 inbound rule is missing — HTTP traffic is blocked!'},
            {t:'info',v:'FIX: aws ec2 authorize-security-group-ingress --group-id sg-0abc123 --protocol tcp --port 80 --cidr 0.0.0.0/0'},
            {t:'success',v:'✔ Port 80 rule added. HTTP traffic restored in ~30 seconds.'}
          ]
        },
        {id:'aws_s3_403',category:'security',name:'S3 Access Denied (403)',
          cmd:'aws s3 ls s3://prod-deployment-bucket\naws iam simulate-principal-policy --policy-source-arn arn:aws:iam::123:role/deploy-role --action-names s3:GetObject --resource-arns arn:aws:s3:::prod-deployment-bucket/*',
          explanation:'CI/CD pipeline failing with S3 403. I simulated the IAM policy and found the deployment role was missing s3:GetObject permission on the bucket. Updated the role inline policy to include the missing action — pipeline passed on next run.',
          output:[
            {t:'prompt',v:'aws s3 ls s3://prod-deployment-bucket'},
            {t:'error',v:'An error occurred (AccessDenied) when calling the ListObjectsV2 operation: Access Denied'},
            {t:'prompt',v:'aws iam simulate-principal-policy ...'},
            {t:'log',v:'EvalActionName: s3:GetObject | EvalDecision: implicitDeny'},
            {t:'error',v:'✖ IAM Role "deploy-role" is DENIED s3:GetObject on this bucket.'},
            {t:'info',v:'FIX: Add s3:GetObject and s3:ListBucket to the role\'s inline policy for this bucket ARN.'},
            {t:'success',v:'✔ Policy updated. Pipeline S3 downloads now succeed.'}
          ]
        },
        {id:'aws_high_cpu',category:'system',name:'EC2 High CPU Alert',
          cmd:'aws cloudwatch get-metric-statistics --namespace AWS/EC2 --metric-name CPUUtilization --dimensions Name=InstanceId,Value=i-0abcd1234 --period 300 --statistics Average\ntop -b -n 1 | head -15\nps aux --sort=-%cpu | head -5',
          explanation:'CloudWatch alarm triggered for CPU > 85% on web server. I pulled CloudWatch metrics to confirm the spike, SSM\'d into the instance, ran top and found a runaway php-fpm worker at 96% CPU. Gracefully restarted php-fpm — CPU dropped to 12% within 90 seconds.',
          output:[
            {t:'prompt',v:'aws cloudwatch get-metric-statistics ... --metric-name CPUUtilization'},
            {t:'warning',v:'CPUUtilization: Average=92.5% (Threshold: 85%) — ALARM STATE'},
            {t:'prompt',v:'ps aux --sort=-%cpu | head -5'},
            {t:'log',v:'www-data  7421  96.5  8.2  php-fpm: pool www (stuck in loop)'},
            {t:'error',v:'✖ PID 7421 (php-fpm) consuming 96.5% CPU — runaway process detected!'},
            {t:'info',v:'FIX: sudo systemctl restart php7.4-fpm'},
            {t:'success',v:'✔ php-fpm restarted. CPU dropped to 12% within 90 seconds.'}
          ]
        }
      ],
      commands:[
        {cmd:'aws ec2 describe-instances --query "Reservations[*].Instances[*].[InstanceId,State.Name,PublicIpAddress]" --output table',desc:'List all EC2 instances with state and IP.',cat:'EC2'},
        {cmd:'aws s3 sync ./dist s3://my-bucket --delete',desc:'Sync local folder to S3, removing deleted files.',cat:'S3'},
        {cmd:'aws logs tail /aws/lambda/my-function --follow',desc:'Stream Lambda function logs in real time.',cat:'Logs'},
        {cmd:'aws iam create-role --role-name MyRole --assume-role-policy-document file://trust.json',desc:'Create a new IAM role with a trust policy.',cat:'IAM'},
        {cmd:'aws cloudwatch put-metric-alarm --alarm-name HighCPU --metric-name CPUUtilization --threshold 80',desc:'Create a CloudWatch alarm for high CPU.',cat:'Monitoring'},
        {cmd:'aws ecr get-login-password | docker login --username AWS --password-stdin <account>.dkr.ecr.<region>.amazonaws.com',desc:'Authenticate Docker to AWS ECR.',cat:'ECR'}
      ]
    },
    docker: {
      title:'Docker', subtitle:'Containerization & Image Management',
      category:'Containers', icon:'fab fa-docker',
      desc:'Docker is my daily driver for containerizing applications. I write multi-stage Dockerfiles to minimize image sizes, use Docker Compose for local multi-service stacks, and push images to ECR and Docker Hub as part of CI/CD pipelines.',
      metrics:[
        {label:'Base Images',val:'Alpine / Distroless'},{label:'Registry',val:'ECR / Docker Hub'},
        {label:'Compose',val:'Multi-service stacks'},{label:'Networks',val:'Bridge / Host / Overlay'},
        {label:'Volumes',val:'Named / Bind mounts'},{label:'Security',val:'Non-root users'}
      ],
      concepts:[
        {icon:'fas fa-layer-group',title:'Multi-stage Builds',desc:'Separate build and runtime stages to produce minimal images. A Node.js app goes from 1.2GB to 180MB.'},
        {icon:'fas fa-network-wired',title:'Docker Networks',desc:'Bridge networks for container-to-container communication, host network for performance-critical workloads.'},
        {icon:'fas fa-hdd',title:'Volumes & Bind Mounts',desc:'Named volumes for persistent database data, bind mounts for development hot-reload workflows.'},
        {icon:'fas fa-shield-alt',title:'Security Practices',desc:'Run containers as non-root users, use read-only filesystems, scan images with Trivy before pushing.'}
      ],
      interview:[
        {q:'How do you reduce Docker image size?',a:'Use multi-stage builds to separate build and runtime. Use Alpine or distroless base images. Combine RUN commands to reduce layers. Use .dockerignore to exclude node_modules and .git.',tip:'Show real numbers: "I reduced our app image from 1.2GB to 160MB using multi-stage builds."'},
        {q:'What happens when you run docker run?',a:'Docker checks for the image locally. If not found, pulls from registry. Creates a container (writable layer on top of image layers). Sets up networking and mounts volumes. Runs the ENTRYPOINT/CMD process as PID 1.',tip:'Mention "copy-on-write" for layers to show deep understanding.'}
      ],
      scenarios:[
        {id:'docker_container_oom',category:'system',name:'Container OOM Killed',
          cmd:'docker stats --no-stream\ndocker inspect <container_id> | grep -A5 OOMKilled\njournalctl -k | grep oom',
          explanation:'Node.js container kept restarting. docker stats showed memory spiking to the 512MB limit before dying. docker inspect confirmed OOMKilled: true. I analyzed a heap dump and found a memory leak in an event listener. Fixed the code and raised memory limit to 1GB as a temporary measure.',
          output:[
            {t:'prompt',v:'docker stats --no-stream'},
            {t:'log',v:'CONTAINER    CPU%   MEM USAGE/LIMIT     MEM%\napi-service  45.2%  511MiB / 512MiB    99.8%'},
            {t:'error',v:'⚠ Memory usage at 99.8% of limit — OOM kill imminent!'},
            {t:'prompt',v:'docker inspect api --format "{{.State.OOMKilled}}"'},
            {t:'error',v:'true  ← Container was OOM-killed!'},
            {t:'info',v:'FIX 1: docker update --memory 1g --memory-swap 2g api-service'},
            {t:'info',v:'FIX 2: Profile heap with clinic.js to find the memory leak in code.'},
            {t:'success',v:'✔ Memory leak patched. Container stable at 280MB after code fix.'}
          ]
        },
        {id:'docker_image_large',category:'storage',name:'Docker Image Too Large',
          cmd:'docker image ls | grep myapp\ndocker history myapp:latest\ndive myapp:latest',
          explanation:'CI pipeline taking 8 minutes to push a 2.1GB image. Used dive to inspect layers and found node_modules and dev dependencies included in the final image. Rewrote the Dockerfile with a multi-stage build — final image dropped to 180MB, push time cut to 45 seconds.',
          output:[
            {t:'prompt',v:'docker image ls | grep myapp'},
            {t:'log',v:'myapp   latest   abc123   2 hours ago   2.14GB  ← TOO LARGE'},
            {t:'prompt',v:'docker history myapp:latest'},
            {t:'error',v:'Layer 3: npm install ---> 1.8GB (includes devDependencies + node_modules!)'},
            {t:'warning',v:'⚠ Dev dependencies and build tools included in runtime image.'},
            {t:'info',v:'FIX: Convert to multi-stage Dockerfile: Stage 1 (builder) → Stage 2 (runtime with only dist/)'},
            {t:'success',v:'✔ Final image: 180MB. Push time: 45s (was 8 minutes). 91% size reduction.'}
          ]
        }
      ],
      commands:[
        {cmd:'docker build -t myapp:latest --no-cache .',desc:'Build image without cache, always fresh build.',cat:'Build'},
        {cmd:'docker run -d --name api -p 3000:3000 --memory 512m --restart unless-stopped myapp:latest',desc:'Run container with memory limit and auto-restart.',cat:'Run'},
        {cmd:'docker compose up -d --build',desc:'Start all services in background, rebuilding changed images.',cat:'Compose'},
        {cmd:'docker system prune -af --volumes',desc:'Remove all stopped containers, images, networks, and volumes.',cat:'Cleanup'},
        {cmd:'docker logs -f --tail 100 mycontainer',desc:'Follow last 100 lines of container logs in real time.',cat:'Debug'},
        {cmd:'docker exec -it mycontainer sh',desc:'Open interactive shell inside running container.',cat:'Debug'}
      ]
    },
    kubernetes: {
      title:'Kubernetes', subtitle:'Container Orchestration at Scale',
      category:'Orchestration', icon:'fas fa-dharmachakra',
      desc:'I manage production Kubernetes clusters where I handle deployments, scaling, and troubleshooting pod failures. I configure HPA for autoscaling, set up Ingress controllers with TLS, and use Helm for package management.',
      metrics:[
        {label:'Workloads',val:'Deployments / StatefulSets'},{label:'Networking',val:'Services / Ingress'},
        {label:'Config',val:'ConfigMaps / Secrets'},{label:'Scaling',val:'HPA / VPA'},
        {label:'Packaging',val:'Helm Charts'},{label:'Storage',val:'PV / PVC / StorageClass'}
      ],
      concepts:[
        {icon:'fas fa-cubes',title:'Pods & Deployments',desc:'Pods are the smallest unit. Deployments manage desired state, rolling updates, and rollbacks.'},
        {icon:'fas fa-random',title:'Services & Ingress',desc:'Services expose pods internally (ClusterIP) or externally (LoadBalancer). Ingress routes HTTP/S with TLS termination.'},
        {icon:'fas fa-balance-scale',title:'HPA (Horizontal Pod Autoscaler)',desc:'Automatically scales pod replicas based on CPU or custom metrics from Prometheus.'},
        {icon:'fas fa-helmet-safety',title:'RBAC & Security',desc:'Role-Based Access Control for fine-grained permissions. NetworkPolicies to isolate namespaces.'}
      ],
      interview:[
        {q:'A pod is in CrashLoopBackOff — how do you debug it?',a:'1. kubectl describe pod <name> — check Events section for scheduling/image errors. 2. kubectl logs <pod> --previous — logs from last crashed container. 3. kubectl exec -it <pod> -- sh — if it starts, check environment/config. 4. Check resource limits — OOM kills show exit code 137.',tip:'Mention exit codes: 137=OOM killed, 1=app error, 126=permission denied.'},
        {q:'How does a rolling update work in Kubernetes?',a:'Kubernetes creates new pods with the new image one at a time. It waits for each new pod to become Ready before killing an old one. maxSurge controls extra pods during update, maxUnavailable controls how many can be down.',tip:'Say you always set minReadySeconds and readinessProbes to prevent bad deployments from going fully live.'}
      ],
      scenarios:[
        {id:'k8s_crashloop',category:'system',name:'Pod CrashLoopBackOff',
          cmd:'kubectl get pods -n production\nkubectl describe pod api-deployment-7d9f8 -n production\nkubectl logs api-deployment-7d9f8 -n production --previous',
          explanation:'Critical API pods going into CrashLoopBackOff in production. kubectl describe showed the pod was being OOM killed (exit code 137). The memory limit was set to 256Mi but the app needed 512Mi after a recent feature addition. Increased limits and the pods stabilized immediately.',
          output:[
            {t:'prompt',v:'kubectl get pods -n production'},
            {t:'error',v:'api-deployment-7d9f8   0/1   CrashLoopBackOff   7   18m'},
            {t:'prompt',v:'kubectl describe pod api-deployment-7d9f8 -n production | tail -20'},
            {t:'log',v:'Limits: memory: 256Mi  |  Last State: Terminated  Reason: OOMKilled  Exit Code: 137'},
            {t:'error',v:'✖ Container OOM-Killed! Memory limit (256Mi) too low for current workload.'},
            {t:'info',v:'FIX: kubectl set resources deployment/api-deployment --limits memory=512Mi -n production'},
            {t:'success',v:'✔ Deployment updated. Pods running stable. Memory usage: 380Mi / 512Mi limit.'}
          ]
        },
        {id:'k8s_image_pull',category:'system',name:'ImagePullBackOff Error',
          cmd:'kubectl describe pod myapp-5d9c7 | grep -A10 Events\nkubectl get secret regcred -n production -o yaml\nkubectl get serviceaccount default -n production -o yaml',
          explanation:'New deployment failing with ImagePullBackOff. Events showed "unauthorized: authentication required" when pulling from private ECR. The namespace was missing the ECR image pull secret. Created the secret with AWS credentials and patched the default service account — next pod came up clean.',
          output:[
            {t:'prompt',v:'kubectl describe pod myapp-5d9c7 | grep Events -A10'},
            {t:'error',v:'Failed to pull image "123.dkr.ecr.us-east-1.amazonaws.com/myapp:v2": unauthorized: authentication required'},
            {t:'warning',v:'⚠ No image pull secret found for this ECR registry.'},
            {t:'info',v:'FIX 1: Create ECR pull secret in the namespace:'},
            {t:'log',v:'kubectl create secret docker-registry regcred --docker-server=<ecr-url> --docker-username=AWS --docker-password=$(aws ecr get-login-password)'},
            {t:'info',v:'FIX 2: Patch service account to use the secret:'},
            {t:'log',v:'kubectl patch serviceaccount default -p \'{"imagePullSecrets": [{"name": "regcred"}]}\''},
            {t:'success',v:'✔ Image pulled successfully. Pod running in 45 seconds.'}
          ]
        }
      ],
      commands:[
        {cmd:'kubectl get pods -A -o wide',desc:'List all pods across all namespaces with node placement.',cat:'Debug'},
        {cmd:'kubectl rollout restart deployment/myapp -n production',desc:'Rolling restart of all pods in a deployment.',cat:'Operations'},
        {cmd:'kubectl top pods -n production --sort-by=memory',desc:'Show CPU and memory usage for pods, sorted by memory.',cat:'Monitoring'},
        {cmd:'kubectl scale deployment/myapp --replicas=5 -n production',desc:'Manually scale a deployment to 5 replicas.',cat:'Scaling'},
        {cmd:'helm upgrade --install myapp ./charts/myapp -f values.prod.yaml -n production',desc:'Deploy or upgrade an app using Helm with production values.',cat:'Helm'},
        {cmd:'kubectl get events -n production --sort-by=.lastTimestamp | tail -20',desc:'Show last 20 events in production namespace sorted by time.',cat:'Debug'}
      ]
    },
    jenkins: {
      title:'Jenkins CI/CD', subtitle:'Pipeline Automation & Continuous Delivery',
      category:'CI/CD', icon:'fas fa-cogs',
      desc:'I build and maintain Jenkins pipelines for build, test, and deploy automation. I write declarative Jenkinsfiles with parallel stages, integrate SonarQube for code quality, and configure webhook triggers from GitHub.',
      metrics:[
        {label:'Pipeline',val:'Declarative / Scripted'},{label:'Triggers',val:'GitHub Webhooks'},
        {label:'Agents',val:'Docker / Kubernetes pods'},{label:'Plugins',val:'50+ integrations'},
        {label:'Quality',val:'SonarQube / OWASP'},{label:'Deploy',val:'SSH / k8s / ArgoCD'}
      ],
      concepts:[
        {icon:'fas fa-stream',title:'Declarative Pipelines',desc:'Jenkinsfile with structured stages: Build → Test → Quality Gate → Docker Build → Deploy.'},
        {icon:'fas fa-box',title:'Docker Agents',desc:'Run each stage in a fresh Docker container — no state pollution between builds.'},
        {icon:'fas fa-shield-alt',title:'Credentials Management',desc:'Store secrets in Jenkins Credential Store, access via withCredentials() or environment variables.'},
        {icon:'fas fa-sync',title:'Blue-Green Deployments',desc:'Deploy to blue environment, run health checks, then switch traffic. Zero-downtime releases.'}
      ],
      interview:[
        {q:'How do you handle secrets in Jenkins pipelines?',a:'Store secrets in Jenkins Credentials Store (not in the Jenkinsfile or source code). Access them using withCredentials() block or via credential binding plugin. For AWS, use IAM roles on agents instead of storing access keys.',tip:'Mention you never hardcode secrets and use environment-specific credential IDs.'},
        {q:'What do you do when a pipeline fails in production?',a:'First identify the failing stage in Blue Ocean or Classic UI. Check the stage logs for the error. If it\'s a test failure, review the test output. If deployment, check rollout status on k8s. Use the Replay feature to debug without committing changes.',tip:'Mention "I always set a timeout on production stages and send Slack notifications on failure."'}
      ],
      scenarios:[
        {id:'jenkins_docker_build_fail',category:'system',name:'Docker Build Failing in Pipeline',
          cmd:'cat Jenkinsfile\ndocker build -t myapp:${BUILD_NUMBER} .\ndocker system df',
          explanation:'Jenkins pipeline failing at Docker build stage with "no space left on device". Checked Jenkins agent disk usage and found docker overlay2 directory consuming 98GB. Ran docker system prune on agents and added a post-build cleanup step to the Jenkinsfile. Also added disk space monitoring to agent nodes.',
          output:[
            {t:'prompt',v:'docker system df'},
            {t:'log',v:'TYPE           TOTAL   ACTIVE  SIZE      RECLAIMABLE\nImages         127     12      94.2GB    82GB (87%)'},
            {t:'error',v:'✖ Docker overlay2 using 94.2GB — agent disk 98% full!'},
            {t:'prompt',v:'docker system prune -af'},
            {t:'success',v:'✔ Deleted 82GB of unused images. Free space: 63GB.'},
            {t:'info',v:'PERMANENT FIX: Added post { always { sh "docker system prune -f" } } to Jenkinsfile.'}
          ]
        },
        {id:'jenkins_webhook',category:'network',name:'GitHub Webhook Not Triggering',
          cmd:'curl -X POST http://jenkins.internal:8080/github-webhook/\ncat /var/log/jenkins/jenkins.log | grep webhook\nnetstat -tlnp | grep 8080',
          explanation:'Developers complained PRs weren\'t triggering builds. Checked GitHub webhook delivery logs and found Jenkins was returning 302 (redirect) instead of 200. The webhook URL was missing the trailing slash. Updated the GitHub webhook URL from /github-webhook to /github-webhook/ — auto-trigger resumed immediately.',
          output:[
            {t:'prompt',v:'curl -I http://jenkins.internal:8080/github-webhook'},
            {t:'error',v:'HTTP/1.1 302 Found  ←  Missing trailing slash causes redirect!'},
            {t:'prompt',v:'curl -I http://jenkins.internal:8080/github-webhook/'},
            {t:'success',v:'HTTP/1.1 200 OK  ←  Correct URL with trailing slash'},
            {t:'error',v:'✖ GitHub webhook was POSTing to /github-webhook (no slash) — Jenkins returned 302.'},
            {t:'info',v:'FIX: Updated GitHub webhook URL to http://jenkins.internal:8080/github-webhook/'},
            {t:'success',v:'✔ Webhook delivery now returning 200. Auto-trigger builds working.'}
          ]
        }
      ],
      commands:[
        {cmd:'jenkins-cli.jar -s http://localhost:8080 list-jobs',desc:'List all Jenkins jobs via CLI.',cat:'Admin'},
        {cmd:'jenkins-cli.jar -s http://localhost:8080 build my-pipeline -f -v',desc:'Trigger a pipeline build and follow output.',cat:'Build'},
        {cmd:'jenkins-cli.jar -s http://localhost:8080 get-job my-pipeline > backup.xml',desc:'Export job configuration as XML backup.',cat:'Admin'},
        {cmd:'docker run -d -p 8080:8080 -v jenkins_home:/var/jenkins_home jenkins/jenkins:lts',desc:'Run Jenkins in Docker with persistent home directory.',cat:'Setup'},
        {cmd:"groovy -e \"Jenkins.instance.items.each { println it.name }\"",desc:'List all jobs using Groovy console script.',cat:'Admin'},
        {cmd:'curl -X POST http://user:token@localhost:8080/job/my-pipeline/build',desc:'Trigger a build via Jenkins REST API.',cat:'API'}
      ]
    },
    terraform: {
      title:'Terraform', subtitle:'Infrastructure as Code & Cloud Provisioning',
      category:'IaC', icon:'fas fa-cubes',
      desc:'I use Terraform to provision and manage AWS infrastructure including VPCs, EC2 instances, RDS databases, and EKS clusters. I structure projects with modules and use remote S3 backends with DynamoDB state locking for team collaboration.',
      metrics:[
        {label:'Provider',val:'AWS / Azure'},{label:'State',val:'S3 + DynamoDB Lock'},
        {label:'Modules',val:'VPC / EKS / RDS'},{label:'Workspaces',val:'dev / staging / prod'},
        {label:'Plan CI',val:'GitHub Actions'},{label:'Drift',val:'terraform plan -refresh'}
      ],
      concepts:[
        {icon:'fas fa-code-branch',title:'State Management',desc:'Terraform state tracks real infrastructure. Remote state in S3 + DynamoDB locking prevents concurrent modification.'},
        {icon:'fas fa-puzzle-piece',title:'Modules',desc:'Reusable infrastructure components. I have modules for VPC, EKS, and RDS that teams import with different variables.'},
        {icon:'fas fa-eye',title:'Plan & Apply Workflow',desc:'terraform plan shows a dry-run diff before applying. I always review plans in CI before auto-applying to staging.'},
        {icon:'fas fa-lock',title:'Sensitive Values',desc:'Use variables marked sensitive = true and inject secrets from AWS Secrets Manager rather than storing in .tfvars.'}
      ],
      interview:[
        {q:'What do you do when terraform apply fails halfway through?',a:'Terraform writes partial state before failing. First, run terraform state list to see what was created. Then fix the underlying issue (e.g., IAM permission, quota) and run terraform apply again — it picks up where it left off. Never delete state files.',tip:'Mention "I keep a state backup in S3 versioning enabled so I can roll back if state gets corrupted."'},
        {q:'How do you handle Terraform state for multiple environments?',a:'I use Terraform workspaces or separate state files per environment using different S3 key prefixes (terraform/dev/terraform.tfstate, terraform/prod/terraform.tfstate). Each environment has its own variable file (dev.tfvars, prod.tfvars).',tip:'Explain you prefer separate state files over workspaces for full isolation in production.'}
      ],
      scenarios:[
        {id:'tf_state_lock',category:'system',name:'State Lock Stuck After Crash',
          cmd:'terraform plan\nterraform force-unlock <lock-id>\naws dynamodb get-item --table-name terraform-locks --key \'{"LockID": {"S": "prod/terraform.tfstate"}}\'',
          explanation:'Engineer\'s laptop crashed mid-apply, leaving a DynamoDB lock on the production state. terraform plan showed "Error acquiring the state lock." I verified the lock was stale by checking the lock timestamp in DynamoDB, confirmed the original apply had failed, then ran terraform force-unlock with the lock ID. State was clean, no drift.',
          output:[
            {t:'prompt',v:'terraform plan'},
            {t:'error',v:'Error: Error acquiring the state lock\nLock ID: 8f3a21b9-...\nPath: s3://tf-state/prod/terraform.tfstate\nOwner: engineer@laptop (crashed 2 hours ago)'},
            {t:'prompt',v:'aws dynamodb get-item --table-name terraform-locks ...'},
            {t:'warning',v:'Lock created: 2h 14m ago | Owner: engineer-laptop | Clearly stale after crash.'},
            {t:'info',v:'terraform force-unlock 8f3a21b9-4c12-48a3-9b6e-d1e3f72abc45'},
            {t:'success',v:'✔ Lock released. terraform plan succeeds. Infrastructure verified — no drift.'}
          ]
        },
        {id:'tf_drift',category:'system',name:'Infrastructure Drift Detected',
          cmd:'terraform plan -refresh-only\nterraform state show aws_security_group.web\nterraform apply -target=aws_security_group.web',
          explanation:'Someone manually added a security group rule in the AWS Console during an incident. Terraform plan showed the drift. I used terraform plan -refresh-only to see all drifted resources, then applied only the affected resource back to the desired state using -target to minimize blast radius.',
          output:[
            {t:'prompt',v:'terraform plan -refresh-only'},
            {t:'warning',v:'~ aws_security_group.web will be updated in-place:'},
            {t:'log',v:'  ~ ingress {\n      - from_port = 8080  # manually added, not in code\n      - to_port   = 8080\n    }'},
            {t:'error',v:'✖ Configuration drift detected! Manual change made outside Terraform.'},
            {t:'info',v:'FIX: terraform apply -target=aws_security_group.web'},
            {t:'success',v:'✔ Drift corrected. Security group matches IaC definition. Manual rule removed.'}
          ]
        }
      ],
      commands:[
        {cmd:'terraform init -backend-config=backend.hcl',desc:'Initialize Terraform with remote backend configuration.',cat:'Core'},
        {cmd:'terraform plan -var-file=prod.tfvars -out=tfplan',desc:'Generate and save a plan using production variables.',cat:'Core'},
        {cmd:'terraform apply tfplan',desc:'Apply the pre-generated plan file without interactive prompts.',cat:'Core'},
        {cmd:'terraform state list | grep aws_instance',desc:'List all EC2 instances tracked in Terraform state.',cat:'State'},
        {cmd:'terraform import aws_instance.web i-0abc1234567890',desc:'Import existing AWS resource into Terraform management.',cat:'State'},
        {cmd:'terraform fmt -recursive && terraform validate',desc:'Format all .tf files and validate configuration syntax.',cat:'Quality'}
      ]
    },
    linux: {
      title:'Linux OS', subtitle:'System Administration & Server Management',
      category:'OS', icon:'fab fa-linux',
      desc:'Linux is the foundation of everything I do. I manage Ubuntu and RHEL servers, write bash scripts for automation, configure systemd services, troubleshoot network issues with ss/netstat, and monitor system health with top/htop and iostat.',
      metrics:[
        {label:'Distros',val:'Ubuntu / RHEL / CentOS'},{label:'Init',val:'Systemd'},
        {label:'Shell',val:'Bash / Zsh'},{label:'Network',val:'ss / netstat / iptables'},
        {label:'Packages',val:'apt / yum / dnf'},{label:'Monitor',val:'top / htop / iostat'}
      ],
      concepts:[
        {icon:'fas fa-cogs',title:'Systemd Services',desc:'Init system managing services. I write custom unit files, enable services on boot, and troubleshoot failures with journalctl.'},
        {icon:'fas fa-tasks',title:'Process Management',desc:'ps, top, kill, nice — controlling processes. Understanding zombie processes, orphans, and signal handling.'},
        {icon:'fas fa-network-wired',title:'Networking Tools',desc:'ss for socket stats, iptables for firewall rules, curl/wget for testing, traceroute for path debugging.'},
        {icon:'fas fa-hdd',title:'Storage & Filesystems',desc:'df for disk usage, lsblk for block devices, mount/umount, LVM for logical volumes, and inode exhaustion debugging.'}
      ],
      interview:[
        {q:'How do you find what process is using port 8080?',a:'ss -tlnp | grep 8080 or lsof -i :8080. The output shows the PID and process name. ss is faster and newer than netstat.',tip:'Show both commands and mention ss is preferred on modern systems as netstat is deprecated.'},
        {q:'A server is slow. How do you troubleshoot?',a:'1. top/htop — check CPU and memory. 2. iostat -x 1 — check disk I/O wait. 3. free -h — check memory/swap usage. 4. ss -s — check connection counts. 5. df -h — check disk space. Triage top-down: CPU → Memory → Disk → Network.',tip:'Mention the mnemonic: CPU → RAM → Disk → Network. Shows structured thinking.'}
      ],
      scenarios:[
        {id:'linux_disk_full',category:'storage',name:'Disk 100% Full — Service Down',
          cmd:'df -h\ndu -sh /* 2>/dev/null | sort -rh | head -10\njournalctl --disk-usage\njournalctl --vacuum-time=7d',
          explanation:'Production nginx stopped writing logs, API returning 500s. df -h showed / at 100%. du scan found /var/log/journal consuming 18GB of old systemd logs. Vacuumed journal logs older than 7 days, freeing 16GB. Service immediately recovered. Added logrotate cron and journal size limit to prevent recurrence.',
          output:[
            {t:'prompt',v:'df -h'},
            {t:'error',v:'/dev/xvda1    40G    40G    0    100%  /   ← FULL!'},
            {t:'prompt',v:'du -sh /var/log/journal'},
            {t:'log',v:'18G    /var/log/journal   ← systemd journal logs consuming 18GB!'},
            {t:'info',v:'journalctl --vacuum-time=7d'},
            {t:'success',v:'Deleted archived journals: 16.2G freed.'},
            {t:'success',v:'✔ Disk: 60% used. Nginx writing logs again. API 500s resolved.'},
            {t:'info',v:'PERMANENT FIX: echo "SystemMaxUse=2G" >> /etc/systemd/journald.conf'}
          ]
        },
        {id:'linux_ssh_fail',category:'security',name:'SSH Connection Refused',
          cmd:'ssh -vvv user@server-ip\ntelnet server-ip 22\nsudo systemctl status sshd\nsudo journalctl -u sshd -n 20',
          explanation:'Could not SSH to a prod server after a security team change. -vvv showed "Connection refused" at TCP level. Telnet to port 22 also failed. Accessed via console, found sshd was stopped (systemctl status showed inactive). A firewall rule change had broken the service restart. Started sshd and fixed the firewall rule.',
          output:[
            {t:'prompt',v:'ssh -vvv admin@10.0.1.45'},
            {t:'error',v:'connect to host 10.0.1.45 port 22: Connection refused'},
            {t:'prompt',v:'sudo systemctl status sshd'},
            {t:'error',v:'sshd.service — FAILED — Loaded: loaded — Active: failed (Result: exit-code)'},
            {t:'prompt',v:'sudo journalctl -u sshd -n 5'},
            {t:'log',v:'error: Bind to port 22 on 0.0.0.0 failed: Address already in use.'},
            {t:'info',v:'FIX: sudo fuser -k 22/tcp && sudo systemctl start sshd'},
            {t:'success',v:'✔ sshd restarted successfully. SSH access restored in 15 seconds.'}
          ]
        }
      ],
      commands:[
        {cmd:'journalctl -fu nginx --since "10 minutes ago"',desc:'Follow nginx logs from the last 10 minutes.',cat:'Logs'},
        {cmd:'ss -tlnp | grep LISTEN',desc:'Show all listening TCP ports with process names.',cat:'Network'},
        {cmd:'awk \'$9 >= 80\' /var/log/nginx/access.log | wc -l',desc:'Count HTTP 5xx errors in nginx access log.',cat:'Logs'},
        {cmd:'lsof -p $(pgrep nginx) | wc -l',desc:'Count open file descriptors for nginx process.',cat:'Debug'},
        {cmd:'find /var/log -name "*.log" -mtime +30 -delete',desc:'Delete log files older than 30 days.',cat:'Cleanup'},
        {cmd:'systemctl list-units --type=service --state=failed',desc:'List all failed systemd services.',cat:'Debug'}
      ]
    },
    azure: {
      title:'Microsoft Azure', subtitle:'Cloud Platform & Enterprise Services',
      category:'Cloud', icon:'fab fa-microsoft',
      desc:'I use Azure for enterprise cloud workloads including Azure VMs, AKS (Azure Kubernetes Service), Azure Container Registry, and Azure DevOps pipelines. I configure RBAC with Azure Active Directory and use Azure Monitor with Log Analytics for production observability.',
      metrics:[
        {label:'Compute',val:'VMs / AKS / Functions'},{label:'Registry',val:'Azure Container Registry'},
        {label:'Networking',val:'VNet / NSG / Load Balancer'},{label:'Identity',val:'Azure AD / RBAC'},
        {label:'CI/CD',val:'Azure DevOps Pipelines'},{label:'Monitor',val:'Azure Monitor / Alerts'}
      ],
      concepts:[
        {icon:'fas fa-id-card',title:'Azure AD & RBAC',desc:'Azure Active Directory manages identities. Role assignments (Owner, Contributor, Reader) control access to resource groups and subscriptions.'},
        {icon:'fas fa-dharmachakra',title:'AKS — Azure Kubernetes Service',desc:'Managed Kubernetes with integrated ACR, Azure Monitor, and AAD-based RBAC. I deploy microservices with Helm on AKS clusters.'},
        {icon:'fas fa-network-wired',title:'Virtual Networks & NSGs',desc:'VNets isolate resources. Network Security Groups act as stateful firewalls at subnet/NIC level — similar to AWS Security Groups.'},
        {icon:'fas fa-code-branch',title:'Azure DevOps Pipelines',desc:'YAML-based CI/CD pipelines that build, test, and deploy to AKS, Azure App Service, or VMs with approval gates.'}
      ],
      interview:[
        {q:'How is Azure NSG different from AWS Security Group?',a:'Both are stateful firewalls. Azure NSGs can be associated with subnets OR NICs. AWS SGs attach to instances. Azure NSGs have priority numbers (100-4096, lower = higher priority). Both are stateful — return traffic is automatically allowed.',tip:'Mention NSG flow logs for debugging — equivalent to VPC Flow Logs on AWS.'},
        {q:'How do you deploy a containerized app on AKS?',a:'1. Push image to Azure Container Registry (ACR). 2. Attach ACR to AKS cluster (az aks update --attach-acr). 3. Write Kubernetes manifests or Helm chart. 4. kubectl apply or helm upgrade --install. 5. Set up HPA and Azure Monitor alerts.',tip:'Mention Workload Identity (replacing pod managed identity) as the modern way to give pods Azure RBAC access.'}
      ],
      scenarios:[
        {id:'azure_vm_unreachable',category:'network',name:'Azure VM Unreachable via SSH',
          cmd:'az vm show -g prod-rg -n web-vm-01 --query powerState\naz network nsg list -g prod-rg -o table\naz network nsg rule list --nsg-name web-nsg -g prod-rg -o table',
          explanation:'Production Azure VM stopped responding to SSH after a security team hardened NSG rules. I checked the VM power state (running), then listed NSG rules and found SSH port 22 was removed. Added an inbound SSH rule restricted to the VPN CIDR (10.0.0.0/8) and SSH was restored without exposing the VM to the public internet.',
          output:[
            {t:'prompt',v:'az vm show -g prod-rg -n web-vm-01 --query powerState'},
            {t:'log',v:'"PowerState/running"  ←  VM is running, not a compute issue'},
            {t:'prompt',v:'az network nsg rule list --nsg-name web-nsg -g prod-rg -o table'},
            {t:'error',v:'Priority 100: DENY ALL inbound  |  No SSH (22) allow rule found!'},
            {t:'error',v:'✖ NSG has no inbound allow rule for port 22 — SSH blocked at network layer.'},
            {t:'info',v:'FIX: az network nsg rule create --nsg-name web-nsg -g prod-rg --name AllowSSH --priority 150 --destination-port-ranges 22 --source-address-prefixes 10.0.0.0/8'},
            {t:'success',v:'✔ NSG rule added. SSH access restored. Only VPN IPs (10.0.0.0/8) can connect.'}
          ]
        },
        {id:'azure_aks_crash',category:'system',name:'AKS Pod OOMKilled',
          cmd:'kubectl get pods -n production\nkubectl describe pod api-pod-xxx -n production\naz monitor metrics list --resource <aks-id> --metric node_memory_working_set_bytes',
          explanation:'API pods on AKS going OOMKilled during peak traffic. kubectl describe confirmed exit code 137 (OOM). Azure Monitor showed node memory at 92%. I increased pod memory limits and added an Azure Monitor alert for node memory > 80% to catch this earlier next time.',
          output:[
            {t:'prompt',v:'kubectl get pods -n production'},
            {t:'error',v:'api-7d9f8   0/1   OOMKilled   12   45m'},
            {t:'prompt',v:'kubectl describe pod api-7d9f8 | grep -A3 "Last State"'},
            {t:'log',v:'Last State: Terminated  Reason: OOMKilled  Exit Code: 137  Memory Limit: 256Mi'},
            {t:'error',v:'✖ Container exceeded 256Mi memory limit — killed by kernel OOM.'},
            {t:'info',v:'FIX: kubectl set resources deployment/api --limits=memory=512Mi -n production'},
            {t:'success',v:'✔ Pods running stable. Added Azure Monitor alert: node memory > 80%.'},
          ]
        }
      ],
      commands:[
        {cmd:'az aks get-credentials --resource-group prod-rg --name my-aks-cluster',desc:'Merge AKS cluster credentials into local kubeconfig.',cat:'AKS'},
        {cmd:'az acr login --name myregistry && docker push myregistry.azurecr.io/myapp:v1',desc:'Authenticate to Azure Container Registry and push image.',cat:'ACR'},
        {cmd:'az vm list -g prod-rg --query "[*].[name,powerState]" -o table',desc:'List all VMs in resource group with power state.',cat:'VMs'},
        {cmd:'az monitor activity-log list --resource-group prod-rg --offset 2h',desc:'Show last 2 hours of activity log for a resource group.',cat:'Monitor'},
        {cmd:'az network nsg rule create --nsg-name my-nsg -g prod-rg --name AllowHTTP --priority 200 --destination-port-ranges 80 443',desc:'Add inbound HTTP/HTTPS rule to an NSG.',cat:'Networking'},
        {cmd:'az aks scale --resource-group prod-rg --name my-aks --node-count 5',desc:'Scale AKS node pool to 5 nodes.',cat:'AKS'}
      ]
    },
    digitalocean: {
      title:'DigitalOcean', subtitle:'Cloud Platform & Managed Kubernetes',
      category:'Cloud', icon:'fas fa-water',
      desc:'I use DigitalOcean for spinning up cost-efficient Droplets (VMs), Managed Kubernetes (DOKS), and Managed Databases. DigitalOcean is ideal for lean startup infrastructure — fast provisioning, simple pricing, and good Kubernetes support.',
      metrics:[
        {label:'Compute',val:'Droplets / DOKS'},{label:'Storage',val:'Spaces / Volumes'},
        {label:'Database',val:'Managed PG / MySQL'},{label:'Networking',val:'Floating IPs / VPC'},
        {label:'Firewall',val:'Cloud Firewall'},{label:'CDN',val:'Spaces CDN'}
      ],
      concepts:[
        {icon:'fas fa-server',title:'Droplets (VMs)',desc:'DigitalOcean VMs. I provision Ubuntu Droplets for web servers, bastion hosts, and CI runners with cloud-init startup scripts.'},
        {icon:'fas fa-dharmachakra',title:'DOKS — Managed Kubernetes',desc:'Fully managed Kubernetes clusters. Worker nodes are Droplets. I deploy apps with Helm, use DOKS with DO Load Balancer for Ingress.'},
        {icon:'fas fa-shield-alt',title:'Cloud Firewall',desc:'Stateful firewall rules applied to Droplets by tag. Much simpler than AWS Security Groups — rules defined by source IP or Droplet tags.'},
        {icon:'fas fa-database',title:'Managed Databases',desc:'Fully managed PostgreSQL and MySQL with automatic backups, failover, and connection pooling via PgBouncer.'}
      ],
      interview:[
        {q:'How do DigitalOcean Droplets compare to AWS EC2?',a:'Both are VMs but DO Droplets have simpler pricing (flat monthly vs per-second), built-in monitoring, and faster provisioning (30-60s). EC2 has more instance types, placement groups, and deeper AWS ecosystem integration. For simple web apps, Droplets are faster to set up.',tip:'Show you understand the trade-offs — DO for simplicity/cost, AWS for enterprise features.'},
        {q:'How do you secure a Droplet?',a:'1. Disable root SSH — use a non-root sudo user. 2. Use SSH keys, disable password auth. 3. Apply Cloud Firewall rules — only allow 22 from your IP. 4. Enable ufw as a secondary firewall. 5. Set up automatic security updates. 6. Use Floating IP to decouple public IP from the instance.',tip:'Mention fail2ban for SSH brute-force protection as a bonus point.'}
      ],
      scenarios:[
        {id:'do_droplet_unreachable',category:'network',name:'Droplet Unreachable After Firewall Change',
          cmd:'doctl compute droplet get 123456789 --format Status,PublicIPv4\ndoctl compute firewall list\ndoctl compute firewall get fw-abc123 --format InboundRules',
          explanation:'Droplet became unreachable after applying a new Cloud Firewall rule set. Used doctl to check the Droplet status (active) and inspected the firewall rules. Found the SSH rule was accidentally removed during a cleanup. Re-added SSH rule allowing only the office IP. Access restored within 60 seconds.',
          output:[
            {t:'prompt',v:'doctl compute droplet get 123456789 --format Status,PublicIPv4'},
            {t:'log',v:'Status: active | IP: 134.209.45.12  ←  Droplet is running'},
            {t:'prompt',v:'doctl compute firewall get fw-abc123 --format InboundRules'},
            {t:'error',v:'InboundRules: [HTTP:80, HTTPS:443]  — SSH (22) RULE MISSING!'},
            {t:'error',v:'✖ Cloud Firewall blocking port 22 — SSH rule was removed.'},
            {t:'info',v:'doctl compute firewall add-rules fw-abc123 --inbound-rules "protocol:tcp,ports:22,address:203.0.113.5/32"'},
            {t:'success',v:'✔ SSH rule added. Access restored. Rule scoped to office IP only.'}
          ]
        },
        {id:'do_disk_full',category:'storage',name:'Droplet Disk Full — App Crash',
          cmd:'df -h\ndu -sh /var/log/* | sort -rh | head -5\ntruncate -s 0 /var/log/nginx/access.log\nlogrotate -f /etc/logrotate.d/nginx',
          explanation:'App crashed with "no space left on device". df -h showed /dev/vda1 at 100%. du scan revealed /var/log/nginx/access.log at 12GB — logrotate had not been running. Truncated the active log file without restarting nginx (safe operation), set up hourly logrotate, and added a DigitalOcean alert for disk > 80%.',
          output:[
            {t:'prompt',v:'df -h'},
            {t:'error',v:'/dev/vda1   25G   25G   0   100%  /   ← DISK FULL'},
            {t:'prompt',v:'du -sh /var/log/nginx/*'},
            {t:'log',v:'12G    /var/log/nginx/access.log   ← Logrotate not running!'},
            {t:'info',v:'FIX: truncate -s 0 /var/log/nginx/access.log'},
            {t:'success',v:'✔ 12GB freed. Disk at 52%. App writing logs normally.'},
            {t:'info',v:'PERMANENT FIX: logrotate -f /etc/logrotate.d/nginx && crontab -e (daily rotation)'}
          ]
        }
      ],
      commands:[
        {cmd:'doctl compute droplet create web-01 --image ubuntu-22-04-x64 --size s-2vcpu-4gb --region nyc1 --ssh-keys <key-id>',desc:'Create a new Ubuntu 22.04 Droplet with 2 vCPU and 4GB RAM.',cat:'Droplets'},
        {cmd:'doctl kubernetes cluster create prod-cluster --region nyc1 --node-pool "name=workers;size=s-4vcpu-8gb;count=3"',desc:'Create a DOKS cluster with 3 worker nodes.',cat:'Kubernetes'},
        {cmd:'doctl compute firewall add-rules fw-id --inbound-rules "protocol:tcp,ports:443,address:0.0.0.0/0"',desc:'Add HTTPS inbound rule to a Cloud Firewall.',cat:'Firewall'},
        {cmd:'doctl databases list --format Name,Engine,Status,Region',desc:'List all managed databases with engine type and status.',cat:'Database'},
        {cmd:'doctl compute snapshot create --droplet-id 123456 --snapshot-name pre-deploy-backup',desc:'Take a snapshot of a Droplet before a risky deployment.',cat:'Backup'},
        {cmd:'doctl compute ssh 123456 --ssh-user root',desc:'SSH into a Droplet using doctl (uses configured SSH key).',cat:'Access'}
      ]
    },
    podman: {
      title:'Podman', subtitle:'Rootless Daemonless Container Engine',
      category:'Containers', icon:'fas fa-cube',
      desc:'Podman is my go-to for rootless, daemon-less containers on RHEL and security-hardened servers. Unlike Docker, Podman runs containers as child processes of the user — no root daemon. I use it on RHEL 8/9 servers and generate systemd unit files for auto-start containers.',
      metrics:[
        {label:'Architecture',val:'Fork-exec (No Daemon)'},{label:'Security',val:'Rootless by Default'},
        {label:'Compatible',val:'Docker CLI Drop-in'},{label:'Pods',val:'Native K8s Pod YAML'},
        {label:'Systemd',val:'Auto-generate units'},{label:'OCI',val:'100% OCI Compliant'}
      ],
      concepts:[
        {icon:'fas fa-user-shield',title:'Rootless Containers',desc:'Podman maps container root to an unprivileged user via user namespaces. Even if a container is breached, the attacker has no host root privileges.'},
        {icon:'fas fa-times-circle',title:'No Daemon Required',desc:'Each container is a direct child process of the user. No central daemon means no single point of failure and no root-level background service.'},
        {icon:'fas fa-sync-alt',title:'Systemd Integration',desc:'podman generate systemd creates unit files so containers auto-start and restart as systemd services — production-ready without Docker Compose.'},
        {icon:'fas fa-exchange-alt',title:'Docker Compatibility',desc:'alias docker=podman works for most workflows. Podman supports Dockerfiles, Docker Hub images, and Docker Compose files (via podman-compose).'}
      ],
      interview:[
        {q:'What is the main advantage of Podman over Docker?',a:'Rootless execution and no daemon. Podman containers run as the calling user — compromising a container doesn\'t give host root. Docker requires a root daemon (dockerd), which is a privilege escalation risk. On RHEL/OpenShift environments, Podman is the default.',tip:'Say: "In a zero-trust production environment, rootless Podman is safer than Docker because the daemon attack surface is eliminated."'},
        {q:'How do you auto-start a Podman container on boot?',a:'1. Run the container: podman run -d --name myapp myimage. 2. Generate a systemd unit: podman generate systemd --name myapp --files. 3. Move unit to ~/.config/systemd/user/ for rootless or /etc/systemd/system/ for root. 4. systemctl enable --now container-myapp.',tip:'This is a key Podman-vs-Docker interview differentiator — Docker uses restart policies, Podman integrates with systemd.'}
      ],
      scenarios:[
        {id:'podman_rootless_fail',category:'security',name:'Rootless Container Port Bind Error',
          cmd:'podman run -d -p 80:8080 nginx:alpine\npodman info | grep rootless\ncat /proc/sys/net/ipv4/ip_unprivileged_port_start',
          explanation:'Running a rootless Podman container with -p 80:8080 failed with "permission denied" because unprivileged users cannot bind ports below 1024. I checked ip_unprivileged_port_start (default 1024), then either used port 8080 on host side or lowered the sysctl to 80 for production. Updated docker-compose replacement to map 8080:8080 instead.',
          output:[
            {t:'prompt',v:'podman run -d -p 80:8080 nginx:alpine'},
            {t:'error',v:'Error: rootlessport cannot expose privileged port 80, you can add "net.ipv4.ip_unprivileged_port_start=80" to /etc/sysctl.conf'},
            {t:'prompt',v:'cat /proc/sys/net/ipv4/ip_unprivileged_port_start'},
            {t:'log',v:'1024  ←  Ports below 1024 require root by default'},
            {t:'info',v:'OPTION 1 (safe): podman run -d -p 8080:8080 nginx:alpine  (use port 8080 on host)'},
            {t:'info',v:'OPTION 2 (system): echo "net.ipv4.ip_unprivileged_port_start=80" >> /etc/sysctl.conf && sysctl -p'},
            {t:'success',v:'✔ Container running on port 8080. Nginx proxying via HAProxy on port 80.'}
          ]
        },
        {id:'podman_systemd',category:'system',name:'Container Not Starting After Reboot',
          cmd:'systemctl --user status container-myapp\npodman generate systemd --name myapp --restart-policy=always --files\nsystemctl --user enable --now container-myapp',
          explanation:'Production Podman container running fine manually but not surviving reboots. Root cause: no systemd unit was generated. I used podman generate systemd to create the unit file, placed it in ~/.config/systemd/user/, and enabled it. The container now auto-starts on reboot and auto-restarts on failure.',
          output:[
            {t:'prompt',v:'systemctl --user status container-myapp'},
            {t:'error',v:'Unit container-myapp.service could not be found.'},
            {t:'prompt',v:'podman generate systemd --name myapp --restart-policy=always --files'},
            {t:'success',v:'Created /home/deploy/.config/systemd/user/container-myapp.service'},
            {t:'info',v:'systemctl --user daemon-reload && systemctl --user enable --now container-myapp'},
            {t:'success',v:'Created symlink container-myapp.service → /home/deploy/.config/systemd/user/'},
            {t:'success',v:'✔ Container now managed by systemd. Auto-starts on reboot.'}
          ]
        }
      ],
      commands:[
        {cmd:'podman run -d --name myapp --rm -p 8080:8080 myimage:latest',desc:'Run a rootless container with auto-remove on stop.',cat:'Run'},
        {cmd:'podman generate systemd --name myapp --restart-policy=always --files --new',desc:'Generate a systemd unit file for a named container.',cat:'Systemd'},
        {cmd:'podman pod create --name mypod -p 8080:80 && podman run --pod mypod nginx',desc:'Create a Podman pod and run a container in it (K8s-style).',cat:'Pods'},
        {cmd:'podman image prune -af',desc:'Remove all unused images to free disk space.',cat:'Cleanup'},
        {cmd:'podman inspect myapp --format "{{.State.Status}} {{.State.OOMKilled}}"',desc:'Check container run status and if it was OOM killed.',cat:'Debug'},
        {cmd:'podman play kube pod.yaml',desc:'Run a Kubernetes YAML pod definition using Podman.',cat:'K8s Compat'}
      ]
    },
    openshift: {
      title:'Red Hat OpenShift', subtitle:'Enterprise Kubernetes Platform',
      category:'Containers', icon:'fas fa-dharmachakra',
      desc:'OpenShift extends Kubernetes with enterprise-grade security (strict SCC by default), built-in CI/CD (Tekton), an integrated image registry, and OpenShift Routes for HTTP/S traffic. I use oc CLI for deployments and manage projects (namespaces) with RBAC.',
      metrics:[
        {label:'Base',val:'Kubernetes + RHEL CoreOS'},{label:'Security',val:'SCC / SCCs'},
        {label:'Registry',val:'Built-in Image Registry'},{label:'Routes',val:'OpenShift Router'},
        {label:'CI/CD',val:'Tekton / OpenShift Pipelines'},{label:'Auth',val:'OAuth / LDAP / AD'}
      ],
      concepts:[
        {icon:'fas fa-lock',title:'Security Context Constraints (SCC)',desc:'OpenShift-specific policy that controls what a pod can do — like PodSecurityPolicy but stricter. Most apps need SCC adjustment to run. The restricted SCC is default and blocks root.'},
        {icon:'fas fa-route',title:'OpenShift Routes',desc:'OpenShift\'s equivalent of Kubernetes Ingress. Routes expose services externally with TLS termination (edge, passthrough, re-encrypt). Simpler syntax than Kubernetes Ingress.'},
        {icon:'fas fa-project-diagram',title:'Projects & RBAC',desc:'Projects are namespaces with additional metadata and RBAC. Each project has default service accounts and quotas. Use oc adm policy to grant roles.'},
        {icon:'fas fa-images',title:'ImageStreams',desc:'OpenShift-native image management. ImageStreams track image versions and automatically trigger deployments when a new image is pushed to the internal registry.'}
      ],
      interview:[
        {q:'Why won\'t my Docker container run on OpenShift?',a:'Most Docker images run as root (USER root or no USER specified). OpenShift enforces restricted SCC which blocks root by default. Fix: 1. Use a non-root USER in Dockerfile. 2. Assign anyuid SCC to the service account. 3. Use an OpenShift-certified base image (ubi8). Always prefer option 1.',tip:'This is the #1 OpenShift interview question. Show you know SCC is the root cause.'},
        {q:'What is the difference between an OpenShift Route and a Kubernetes Ingress?',a:'Both expose services externally but Routes are OpenShift-native. Routes support three TLS modes: edge (TLS termination at router), passthrough (TLS all the way to pod), and re-encrypt. Kubernetes Ingress requires an Ingress controller and more YAML. Routes have a simpler API.',tip:'Mention you can create a Route with: oc expose service myapp — one command, no YAML needed.'}
      ],
      scenarios:[
        {id:'oc_scc_error',category:'security',name:'Pod Fails Due to SCC Restriction',
          cmd:'oc get pods -n myproject\noc describe pod myapp-1-xyz | grep -A5 Events\noc adm policy add-scc-to-serviceaccount anyuid -z default -n myproject',
          explanation:'App pod failing with "container has runAsNonRoot and image will run as root" error. The Docker image was built with no USER directive, defaulting to root. OpenShift\'s restricted SCC blocked it. I updated the Dockerfile to add USER 1001 (non-root). As a temporary fix for testing, I added anyuid SCC to the service account.',
          output:[
            {t:'prompt',v:'oc describe pod myapp-1-xyz | grep -A5 Events'},
            {t:'error',v:'Error: container has runAsNonRoot and image will run as root (pod: myapp-1-xyz, container: myapp)'},
            {t:'error',v:'✖ OpenShift SCC blocked container — image runs as root, restricted SCC forbids it.'},
            {t:'info',v:'BEST FIX: Add "USER 1001" to Dockerfile before ENTRYPOINT and rebuild image.'},
            {t:'info',v:'TEMP FIX: oc adm policy add-scc-to-serviceaccount anyuid -z default -n myproject'},
            {t:'success',v:'✔ Pod running after Dockerfile patched. Non-root user confirmed (id: 1001).'}
          ]
        },
        {id:'oc_route_502',category:'network',name:'OpenShift Route Returns 502',
          cmd:'oc get route myapp -n production\noc get svc myapp -n production\noc get endpoints myapp -n production\noc logs <pod> -n production | tail -20',
          explanation:'Route returning 502 after a new deployment. The service was pointing to the right port but oc get endpoints showed 0 endpoints — all pods were in CrashLoopBackOff. I checked pod logs and found a missing environment variable (DB_HOST) after a ConfigMap update. Fixed the ConfigMap and restarted the deployment.',
          output:[
            {t:'prompt',v:'oc get endpoints myapp -n production'},
            {t:'error',v:'NAME    ENDPOINTS   AGE\nmyapp   <none>      5m   ← 0 healthy pods backing the service!'},
            {t:'prompt',v:'oc get pods -n production'},
            {t:'error',v:'myapp-3-abc   0/1   CrashLoopBackOff   5   5m'},
            {t:'prompt',v:'oc logs myapp-3-abc | tail -5'},
            {t:'error',v:'Error: DB_HOST environment variable is not set. Exiting.'},
            {t:'info',v:'FIX: oc edit configmap myapp-config -n production  (add DB_HOST value)'},
            {t:'info',v:'oc rollout restart deployment/myapp -n production'},
            {t:'success',v:'✔ Pods running. Route returning 200. Endpoint healthy.'}
          ]
        }
      ],
      commands:[
        {cmd:'oc new-project myproject --display-name="My App"',desc:'Create a new OpenShift project (namespace).',cat:'Projects'},
        {cmd:'oc new-app --image=nginx --name=my-nginx',desc:'Deploy a container image as a new OpenShift application.',cat:'Deploy'},
        {cmd:'oc expose svc/my-nginx --hostname=myapp.apps.cluster.example.com',desc:'Create a Route to expose a service externally.',cat:'Routes'},
        {cmd:'oc adm policy add-scc-to-serviceaccount anyuid -z default -n myproject',desc:'Allow containers to run as any UID in a namespace.',cat:'Security'},
        {cmd:'oc rollout status deployment/myapp -n production',desc:'Watch rollout status of a deployment until complete.',cat:'Deploy'},
        {cmd:'oc rsh pod/myapp-1-xyz',desc:'Open a remote shell inside a running OpenShift pod.',cat:'Debug'}
      ]
    },
    monitoring: {
      title:'Prometheus & Grafana', subtitle:'Metrics Collection & Observability Dashboards',
      category:'Monitoring', icon:'fas fa-chart-line',
      desc:'I set up Prometheus to scrape metrics from Kubernetes pods, Node Exporter for host-level metrics, and Alertmanager for routing alerts to Slack. Grafana dashboards give teams real-time visibility into CPU, memory, request rates, and error rates across all services.',
      metrics:[
        {label:'Scrape',val:'Prometheus + Exporters'},{label:'Storage',val:'TSDB / Thanos'},
        {label:'Alerting',val:'Alertmanager + Slack'},{label:'Dashboard',val:'Grafana'},
        {label:'Targets',val:'Node / App / k8s'},{label:'Query',val:'PromQL'}
      ],
      concepts:[
        {icon:'fas fa-clock',title:'Prometheus Scraping',desc:'Prometheus pulls (scrapes) metrics from /metrics endpoints every 15-30s. Service discovery finds Kubernetes pods automatically via annotations.'},
        {icon:'fas fa-code',title:'PromQL — Prometheus Query Language',desc:'Powerful query language for time-series data. rate(), increase(), histogram_quantile() for p99 latency. I use it to build alert rules and Grafana panels.'},
        {icon:'fas fa-bell',title:'Alertmanager',desc:'Routes alerts from Prometheus to Slack, PagerDuty, or email. Groups related alerts, silences during maintenance, and inhibits redundant alerts.'},
        {icon:'fas fa-tachometer-alt',title:'Grafana Dashboards',desc:'I build dashboards with RED metrics (Rate, Errors, Duration) for services and USE (Utilization, Saturation, Errors) for infrastructure.'}
      ],
      interview:[
        {q:'What are RED metrics and why do you use them?',a:'RED = Rate (requests/sec), Errors (failed requests/sec), Duration (latency distribution). These three metrics tell you if a service is healthy. Rate drops = traffic issue. Error rate spikes = bug or downstream failure. Duration increases = performance degradation.',tip:'Pair RED with USE (Utilization, Saturation, Errors) for infrastructure. Say you use both frameworks — RED for services, USE for nodes.'},
        {q:'How do you write a Prometheus alert for high error rate?',a:'Use a recording rule to calculate error rate, then an alerting rule: alert: HighErrorRate, expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05, for: 2m, annotations with a Slack summary.',tip:'Mention the "for: 2m" duration prevents flapping — the condition must be true for 2 minutes before alerting.'}
      ],
      scenarios:[
        {id:'prometheus_alert_firing',category:'system',name:'High Error Rate Alert Firing',
          cmd:'curl http://prometheus:9090/api/v1/query?query=rate(http_requests_total{status=~"5.."}[5m])\nkubectl logs -n production deployment/api --since=10m | grep ERROR | tail -20\ncurl http://api:8080/metrics | grep http_requests_total',
          explanation:'Slack alert fired: API error rate > 5% for 3 minutes. Queried Prometheus and confirmed 8.2% error rate. Checked API pod logs and found "connection refused" errors to the database — the RDS connection pool was exhausted after a traffic spike. Increased max_connections in the connection pool config and restarted the API pods. Error rate dropped to 0.1% within 2 minutes.',
          output:[
            {t:'prompt',v:'curl http://prometheus:9090/api/v1/query?query=rate(http_requests_total{status=~"5.."}[5m])'},
            {t:'error',v:'error_rate: 0.082 (8.2%)  ←  Threshold: 5%  ALERT FIRING!'},
            {t:'prompt',v:'kubectl logs deployment/api --since=10m | grep ERROR | tail -5'},
            {t:'error',v:'ERROR: connect ECONNREFUSED db-host:5432 — all DB connections exhausted'},
            {t:'error',v:'✖ RDS connection pool exhausted — DB max_connections reached!'},
            {t:'info',v:'FIX: Update pool.max in app config from 10 to 50. Restart API pods.'},
            {t:'success',v:'✔ Error rate: 0.1% after 2 mins. Prometheus alert resolved. Slack notified.'}
          ]
        },
        {id:'grafana_no_data',category:'system',name:'Grafana Dashboard Showing No Data',
          cmd:'curl http://prometheus:9090/api/v1/targets | python3 -m json.tool | grep health\nkubectl get servicemonitor -n monitoring\nkubectl annotate pod myapp-xyz prometheus.io/scrape=true prometheus.io/port=8080',
          explanation:'New service deployed but Grafana showed "No data" for all panels. Checked Prometheus targets — the new pod was missing. The ServiceMonitor was not selecting the pod because the app label selector did not match (app: myapp vs app: myApp — case mismatch). Fixed the label, Prometheus started scraping within 30 seconds, and Grafana panels populated.',
          output:[
            {t:'prompt',v:'curl http://prometheus:9090/api/v1/targets | grep myapp'},
            {t:'error',v:'(no output)  ← myapp target is NOT registered in Prometheus!'},
            {t:'prompt',v:'kubectl get servicemonitor myapp -n monitoring -o yaml | grep selector'},
            {t:'log',v:'selector: matchLabels: app: myapp'},
            {t:'prompt',v:'kubectl get pod -l app=myApp -n production'},
            {t:'error',v:'(pods found with label app=myApp — capital A!)'},
            {t:'error',v:'✖ Label mismatch: ServiceMonitor looks for app=myapp, pod has app=myApp'},
            {t:'info',v:'FIX: kubectl label pod <pod-name> app=myapp --overwrite -n production'},
            {t:'success',v:'✔ Target appears in Prometheus in 30s. Grafana panels showing data.'}
          ]
        }
      ],
      commands:[
        {cmd:'curl http://localhost:9090/api/v1/query?query=up',desc:'Check which Prometheus targets are up (1=up, 0=down).',cat:'Prometheus'},
        {cmd:'promtool check rules /etc/prometheus/rules/*.yml',desc:'Validate Prometheus alerting rules syntax before applying.',cat:'Prometheus'},
        {cmd:'curl -X POST http://localhost:9090/-/reload',desc:'Hot-reload Prometheus configuration without restart.',cat:'Prometheus'},
        {cmd:'amtool alert query --alertmanager.url=http://localhost:9093',desc:'List all currently firing Alertmanager alerts.',cat:'Alertmanager'},
        {cmd:'kubectl port-forward svc/grafana 3000:3000 -n monitoring',desc:'Forward Grafana port to localhost for local access.',cat:'Grafana'},
        {cmd:'curl -s http://localhost:9100/metrics | grep node_filesystem_avail',desc:'Check available disk space from Node Exporter metrics.',cat:'Node Exporter'}
      ]
    }
  };

  /* ═══════════════════════════════════════════════════════════════════
     3. STATE
  ═══════════════════════════════════════════════════════════════════ */
  let activeTool    = 'aws';
  let activeTab     = 'overview';
  let activeScenario= null;
  let activeCat     = 'All';
  let activeCmdCat  = 'All';
  let isTyping      = false;

  /* ═══════════════════════════════════════════════════════════════════
     4. BOOTSTRAP — run on DOMContentLoaded (safe, no polling needed)
  ═══════════════════════════════════════════════════════════════════ */
  function init() {
    buildToolGrid();
    loadTool('aws');
    attachEvents();
  }

  function buildToolGrid() {
    const grid = document.getElementById('cc-tool-grid');
    if (!grid) return;
    const defs = [
      ['aws','fab fa-aws','AWS'],['docker','fab fa-docker','Docker'],
      ['kubernetes','fas fa-dharmachakra','Kubernetes'],['jenkins','fas fa-cogs','Jenkins'],
      ['terraform','fas fa-cubes','Terraform'],['linux','fab fa-linux','Linux'],
      ['azure','fab fa-microsoft','Azure'],['digitalocean','fas fa-water','DigitalOcean'],
      ['podman','fas fa-cube','Podman'],['openshift','fas fa-dharmachakra','OpenShift'],
      ['monitoring','fas fa-chart-line','Prometheus & Grafana']
    ];
    grid.innerHTML = defs.map(([key,icon,label]) =>
      `<button class="cc-tool-btn${key==='aws'?' active':''}" data-tool="${key}">
         <i class="${icon}"></i><span>${label}</span>
       </button>`
    ).join('');
  }

  function loadTool(key) {
    const data = TOOLS[key]; if (!data) return;
    activeTool = key; activeCat = 'All'; activeCmdCat = 'All'; isTyping = false;
    activeScenario = data.scenarios[0] || null;

    // Header
    setText('cc-tool-icon', `<i class="${data.icon}"></i>`);
    setText('cc-tool-title', data.title);
    setText('cc-tool-subtitle', data.subtitle);
    setText('cc-tool-category', data.category);

    // Overview
    setText('cc-overview-desc', data.desc);
    setText('cc-metrics', data.metrics.map(m =>
      `<div class="cc-metric"><strong>${m.val}</strong><span>${m.label}</span></div>`
    ).join(''));
    setText('cc-concepts', data.concepts.map(c =>
      `<li><i class="${c.icon}"></i><div><strong>${c.title}</strong>${c.desc}</div></li>`
    ).join(''));
    setText('cc-interview', data.interview.length ?
      `<div class="cc-interview"><h4><i class="fas fa-graduation-cap"></i> Interview Q&A</h4>` +
      data.interview.map(q => `
        <div class="cc-qna">
          <div class="cc-qna-q"><span>Q</span>${q.q}</div>
          <div class="cc-qna-a"><span>A</span>${q.a}</div>
          <div class="cc-qna-tip">💡 ${q.tip}</div>
        </div>`).join('') + '</div>' : '');

    renderScenarios();
    renderCommands();
    switchTab('overview');
  }

  function switchTab(tab) {
    activeTab = tab;
    document.querySelectorAll('.cc-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    document.querySelectorAll('.cc-panel').forEach(p => p.classList.toggle('active', p.id === `cc-panel-${tab}`));
  }

  function renderScenarios() {
    const data = TOOLS[activeTool];
    // Filter buttons
    const cats = ['All', ...new Set(data.scenarios.map(s => s.category))];
    setText('cc-scenario-filter', cats.map(c =>
      `<button class="cc-filter-btn${c===activeCat?' active':''}" data-cat="${c}">${c}</button>`
    ).join(''));

    const filtered = activeCat === 'All' ? data.scenarios : data.scenarios.filter(s => s.category === activeCat);
    setText('cc-scenario-list', filtered.map((s, i) =>
      `<button class="cc-sc-btn${i===0?' active':''}" data-id="${s.id}">
        ${s.name}<span class="cc-sc-category">${s.category}</span>
       </button>`
    ).join(''));

    if (filtered.length) loadScenario(filtered[0]);
  }

  function loadScenario(sc) {
    activeScenario = sc;
    setText('cc-explanation', sc.explanation);
    setText('cc-terminal-body',
      `<div class="cc-term-line"><span class="cc-prompt">nikhil@ops-center:~$</span> ` +
      `<span style="color:#6366f1">Playbook loaded. Click <strong>Run</strong> to execute.</span></div>` +
      `<div class="cc-term-line" style="margin-top:.8rem"><span style="color:#fbbf24;font-weight:700">Command:</span><br>` +
      `<pre style="font-family:'Fira Code',monospace;color:#e2e8f0;margin:.4rem 0;font-size:1.2rem;white-space:pre-wrap">${sc.cmd}</pre></div>`
    );
  }

  function runPlaybook() {
    if (!activeScenario || isTyping) return;
    isTyping = true;
    const btn = document.getElementById('cc-btn-run');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Running...'; }
    const body = document.getElementById('cc-terminal-body');
    body.innerHTML = '';

    const cmdLines = activeScenario.cmd.split('\n').filter(l => l.trim());
    let ci = 0;

    function typeNext() {
      if (ci >= cmdLines.length) { printOutput(activeScenario.output); return; }
      const raw = cmdLines[ci];
      const div = document.createElement('div'); div.className = 'cc-term-line';
      div.innerHTML = `<span class="cc-prompt">nikhil@ops-center:~$</span> <span class="cc-cmd-text"></span><span class="cc-cursor"> </span>`;
      body.appendChild(div); body.scrollTop = body.scrollHeight;
      const cmd = div.querySelector('.cc-cmd-text'), cursor = div.querySelector('.cc-cursor');
      let ch = 0;
      function typeChar() {
        if (ch < raw.length) { cmd.textContent += raw[ch++]; setTimeout(typeChar, 14); }
        else { cursor.remove(); ci++; setTimeout(typeNext, 280); }
      }
      typeChar();
    }

    function printOutput(lines) {
      const colorMap = {log:'cc-out-log',success:'cc-out-success',error:'cc-out-error',warning:'cc-out-warning',info:'cc-out-info',prompt:'cc-out-log'};
      let oi = 0;
      function next() {
        if (oi >= lines.length) {
          isTyping = false;
          if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-play"></i> Run'; }
          return;
        }
        const l = lines[oi++];
        const div = document.createElement('div'); div.className = 'cc-term-line';
        div.innerHTML = `<span class="${colorMap[l.t]||'cc-out-log'}">${l.v}</span>`;
        body.appendChild(div); body.scrollTop = body.scrollHeight;
        setTimeout(next, 340);
      }
      next();
    }
    typeNext();
  }

  function renderCommands() {
    const data = TOOLS[activeTool];
    const cats = ['All', ...new Set(data.commands.map(c => c.cat))];
    setText('cc-cmd-filters', cats.map(c =>
      `<button class="cc-filter-pill${c===activeCmdCat?' active':''}" data-cmdcat="${c}">${c}</button>`
    ).join(''));

    const search = (document.getElementById('cc-cmd-search')||{}).value?.toLowerCase().trim()||'';
    const filtered = data.commands.filter(c => {
      const matchCat = activeCmdCat==='All'||c.cat===activeCmdCat;
      const matchSearch = !search||c.cmd.toLowerCase().includes(search)||c.desc.toLowerCase().includes(search);
      return matchCat && matchSearch;
    });
    setText('cc-cmd-list', filtered.map(c =>
      `<div class="cc-cmd-card">
        <div class="cc-cmd-card-top">
          <code class="cc-cmd-syntax">${c.cmd}</code>
          <button class="cc-cmd-copy" data-cmd="${c.cmd.replace(/"/g,'&quot;')}"><i class="far fa-copy"></i> Copy</button>
        </div>
        <p class="cc-cmd-desc">${c.desc}</p>
        <span class="cc-cmd-tag">${c.cat}</span>
      </div>`
    ).join(''));
    const el = document.getElementById('cc-cmd-count');
    if (el) el.textContent = `Showing ${filtered.length} of ${data.commands.length} commands`;
  }

  /* ═══════════════════════════════════════════════════════════════════
     5. EVENT DELEGATION — one listener on the section
  ═══════════════════════════════════════════════════════════════════ */
  function attachEvents() {
    const section = document.getElementById('tools') || document;

    section.addEventListener('click', function(e) {
      const t = e.target.closest('[data-tool],[data-tab],[data-id],[data-cat],[data-cmdcat],.cc-cmd-copy,#cc-btn-run,#cc-btn-copy');
      if (!t) return;

      if (t.dataset.tool) {
        if (isTyping) return;
        document.querySelectorAll('.cc-tool-btn').forEach(b => b.classList.remove('active'));
        t.classList.add('active');
        loadTool(t.dataset.tool);
        return;
      }
      if (t.dataset.tab) {
        if (isTyping) return;
        switchTab(t.dataset.tab);
        return;
      }
      if (t.dataset.id) {
        if (isTyping) return;
        const sc = TOOLS[activeTool].scenarios.find(s => s.id === t.dataset.id);
        if (!sc) return;
        document.querySelectorAll('.cc-sc-btn').forEach(b => b.classList.remove('active'));
        t.classList.add('active');
        loadScenario(sc);
        return;
      }
      if (t.dataset.cat) {
        activeCat = t.dataset.cat;
        renderScenarios();
        return;
      }
      if (t.dataset.cmdcat) {
        activeCmdCat = t.dataset.cmdcat;
        renderCommands();
        return;
      }
      if (t.id === 'cc-btn-run') { runPlaybook(); return; }
      if (t.id === 'cc-btn-copy') {
        if (!activeScenario) return;
        navigator.clipboard.writeText(activeScenario.cmd).then(() => {
          t.innerHTML = '<i class="fas fa-check"></i> Copied!';
          setTimeout(() => { t.innerHTML = '<i class="far fa-copy"></i> Copy'; }, 1800);
        });
        return;
      }
      if (t.classList.contains('cc-cmd-copy')) {
        const cmd = t.getAttribute('data-cmd');
        navigator.clipboard.writeText(cmd).then(() => {
          t.innerHTML = '<i class="fas fa-check"></i> Copied!';
          setTimeout(() => { t.innerHTML = '<i class="far fa-copy"></i> Copy'; }, 1500);
        });
        return;
      }
    });

    section.addEventListener('input', function(e) {
      if (e.target.id === 'cc-cmd-search') renderCommands();
    });
  }

  function setText(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  /* ═══════════════════════════════════════════════════════════════════
     6. KICK OFF
  ═══════════════════════════════════════════════════════════════════ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
