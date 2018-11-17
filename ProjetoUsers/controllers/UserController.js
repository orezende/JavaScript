class UserController{

    constructor(formId, tableId){ //start constructor
        this.tableEl = document.getElementById(tableId);
        this.formEl = document.getElementById(formId);

        this.onSubmit();

    } //end constructor

    onSubmit(){ //start submit

        this.formEl.addEventListener("submit", event => { // ao clicar no botão 'enviar' irá executar essa ação

            event.preventDefault(); // cancela o ato padrão do envio do form 

            let btn = this.formEl.querySelector("[type =submit]");

            btn.disabled = true; 

            let values = this.getValues();

            this.getPhoto().then((content)=>{
                // primeira function
                values.photo = content;
                this.addLine(values); 
                btn.disabled = false; 
                this.formEl.reset();
            }, (e)=>{
                // segunda function
                console.error(e);

            });

           
           
        });
    } //end submit

    getPhoto(){ //start metodo getPhoto

        return new Promise((resolve, reject)=>{

            let fileReader = new FileReader(); // chamamos a api do file reader.

            let elements = [...this.formEl.elements].filter(item => {
                if(item.name === 'photo') {
                    return item; 
                } 
            });
            
            let file = elements[0].files[0];
            
            fileReader.onload = ()=>{

                resolve(fileReader.result);

            };

            fileReader.onerror = (e) => {
                reject(e);
            };

            if(file) fileReader.readAsDataURL(file);
            else {
                resolve('dist/img/avatardefault.png');
            }

        });

    } // end getPhoto

    addLine(dataUser){ // criada a funciton addLine para adicionar uma nova linha de usuário
        
        let locale = "pt-BR";

        let tr = document.createElement('tr');

        tr.innerHTML = ` 
        
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${dataUser.admin}</td>
            <td>${dataUser.register.toLocaleDateString(locale)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        
        `;
        this.tableEl.appendChild(tr); 

    } // end addLine

    getValues(){ //start getValues 

        let newUser = {};
        let isValid = true; 
        [...this.formEl.elements].forEach(function(field, index){ // estamos rodando os valores do form com um foreach 

            if(['name','email','password','country'].indexOf(field.name) > -1 && !field.value){
                field.parentElement.classList.add('has-error');
                isValid = false;  
            }

            if (field.name === 'gender' && field.checked) {
                newUser[field.name] = field.value;
            }else if(field.name === 'admin' && field.checked == false){
                newUser[field.name] = 'Não';
            }else if (field.name !== 'gender') {
                newUser[field.name] = field.value;
            }
    
        });
        
       if(!isValid) return false; 

       return new User( // instanciamos a class user
            newUser.name,
            newUser.gender,
            newUser.birth,
            newUser.country,
            newUser.email,
            newUser.password,
            newUser.photo,
            newUser.admin
        );
    } //end getValues


}