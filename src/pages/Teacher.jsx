import { useState } from "react";
import { Input, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';
import Swal from "sweetalert2";

const props = {
    name: 'file',
    action: 'https://localhost:8080/exercise',
    headers: {
        method: "POST",
        "content-type": "multipart/form-data"
    },
    onChange(info) {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
};

const Teacher = () => {
    const [isLoggedIn, setIsLoggedIn] = useState();
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    return <div className="flex items-center justify-center w-full min-h-screen bg-[rgba(0,0,0,.06)]">
        {!isLoggedIn && <div className="bg-white px-[30px] py-[12px] rounded-[12px] flex flex-col items-center">
            <p className="text-center font-[600] text-[18px] mb-[10px]">LOGIN</p>
            <Space
                direction="vertical"
                style={{
                    width: '100%',
                }}
            >
                <Input placeholder="Username" onChange={(e) => { setUsername(e.target.value) }} />
                <Input placeholder="Password" onChange={(e) => { setPassword(e.target.value) }} />
            </Space>
            <div className="bg-[#0583d2] inline-block px-[10px] py-[4px] mt-[10px] rounded-[10px] text-white text-[14px] font-[500 ] active:translate-y-[5px] transition-all ease-linear"
                onClick={() => {
                    fetch("http://localhost:8080/auth", {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            username: username,
                            password: password
                        })
                    }).then(() => {
                        setIsLoggedIn(true);
                    }).catch(() => {
                        Swal.fire("Error", "Wrong username or password", "error")
                    })
                }}>
                <p>Login in</p>
            </div>
        </div>}
        {
            isLoggedIn && <div className="bg-white px-[30px] py-[12px] rounded-[12px] flex flex-col items-center">
                <p className="text-center font-[600] text-[18px] mb-[10px]">Import file</p>

                <input type="file" onChange={(e) => {
                    const file = e.target.files[0];

                    if (file) {
                        const data = new FormData();
                        data.append('file', file);

                        fetch("http://localhost:8080/exercise", {
                            method: "POST",
                            headers: {
                            },
                            body: data
                        })
                            .then(response => {
                                if (response.ok) {
                                    Swal.fire("Success", "Upload file successfully", "success");
                                } else {
                                    throw new Error('Failed to upload file');
                                }
                            })
                            .catch(error => {
                                Swal.fire("Error", "Failed to upload file", "error");
                            });
                    }
                }} />



            </div>
        }
    </div>
}

export default Teacher;